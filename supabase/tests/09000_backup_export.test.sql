BEGIN;
SELECT plan(3);

DO $$
DECLARE
    v_user_id UUID := '11111111-1111-4111-a111-111111111111';
    v_tree_id UUID := '22222222-2222-4222-a222-222222222222';
    v_person_id UUID := '33333333-3333-4333-a333-333333333333';
    v_export_data JSONB;
BEGIN
    INSERT INTO public.profiles (id, full_name) VALUES (v_user_id, 'Tester Export')
    ON CONFLICT (id) DO NOTHING;

    INSERT INTO public.family_trees (id, name, status, privacy_level, created_by, updated_by)
    VALUES (v_tree_id, 'Cây Test Export', 'active', 'private', v_user_id, v_user_id)
    ON CONFLICT (id) DO NOTHING;

    INSERT INTO public.tree_memberships (tree_id, user_id, role, status, created_by, updated_by)
    VALUES (v_tree_id, v_user_id, 'owner', 'active', v_user_id, v_user_id)
    ON CONFLICT (tree_id, user_id) DO NOTHING;

    INSERT INTO public.persons (id, tree_id, full_name, normalized_name, gender, living_status, created_by, updated_by)
    VALUES (v_person_id, v_tree_id, 'Nguyễn Văn Export', 'nguyen van export', 'male', 'living', v_user_id, v_user_id)
    ON CONFLICT (id) DO NOTHING;
END;
$$;

-- Giả lập auth.uid()
SET LOCAL ROLE authenticated;
SELECT set_config('request.jwt.claim.sub', '11111111-1111-4111-a111-111111111111', true);

SELECT ok(
    (SELECT (public.export_family_tree_backup('22222222-2222-4222-a222-222222222222'::uuid)->>'schemaVersion')::int = 1),
    'Export trả về đúng schemaVersion = 1'
);

SELECT ok(
    (SELECT (public.export_family_tree_backup('22222222-2222-4222-a222-222222222222'::uuid)->'tree'->>'name') = 'Cây Test Export'),
    'Export chứa đúng thông tin Tree name'
);

SELECT ok(
    (SELECT jsonb_array_length(public.export_family_tree_backup('22222222-2222-4222-a222-222222222222'::uuid)->'persons') = 1),
    'Export chứa đúng danh sách Person trong cây'
);

SELECT * FROM finish();
ROLLBACK;
