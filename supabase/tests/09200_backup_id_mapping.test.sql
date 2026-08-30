BEGIN;
SELECT plan(2);

DO $$
DECLARE
    v_user_id UUID := '11111111-1111-4111-a111-111111111111';
    v_new_tree_id UUID := 'aaaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaaa';
    v_parent_id UUID := 'bbbbbbbb-bbbb-4bbb-bbbb-bbbbbbbbbbbb';
    v_child_id UUID := 'cccccccc-cccc-4ccc-cccc-cccccccccccc';
    v_rel_id UUID := 'dddddddd-dddd-4ddd-dddd-dddddddddddd';
    v_payload JSONB;
    v_res JSONB;
BEGIN
    INSERT INTO public.profiles (id, full_name) VALUES (v_user_id, 'Tester Mapping')
    ON CONFLICT (id) DO NOTHING;

    PERFORM set_config('request.jwt.claim.sub', v_user_id::text, true);

    v_payload := jsonb_build_object(
        'tree', jsonb_build_object(
            'id', v_new_tree_id,
            'name', 'Cây Mapping Test',
            'privacyLevel', 'private',
            'generationAnchorPersonId', v_parent_id
        ),
        'persons', jsonb_build_array(
            jsonb_build_object(
                'id', v_parent_id,
                'fullName', 'Nguyễn Văn Cha',
                'gender', 'male',
                'livingStatus', 'living'
            ),
            jsonb_build_object(
                'id', v_child_id,
                'fullName', 'Nguyễn Văn Con',
                'gender', 'male',
                'livingStatus', 'living'
            )
        ),
        'parentChildRelationships', jsonb_build_array(
            jsonb_build_object(
                'id', v_rel_id,
                'parentId', v_parent_id,
                'childId', v_child_id,
                'parentRole', 'father',
                'relationshipKind', 'biological'
            )
        ),
        'unions', '[]'::jsonb,
        'unionMembers', '[]'::jsonb
    );

    v_res := public.import_family_tree_backup(v_payload);
END;
$$;

SELECT ok(
    EXISTS (
        SELECT 1 FROM public.parent_child_relationships
        WHERE id = 'dddddddd-dddd-4ddd-dddd-dddddddddddd'::uuid
          AND parent_id = 'bbbbbbbb-bbbb-4bbb-bbbb-bbbbbbbbbbbb'::uuid
          AND child_id = 'cccccccc-cccc-4ccc-cccc-cccccccccccc'::uuid
    ),
    'Quan hệ cha-con được import chính xác với các ID đã được map'
);

SELECT ok(
    (SELECT generation_anchor_person_id FROM public.family_trees WHERE id = 'aaaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaaa'::uuid) = 'bbbbbbbb-bbbb-4bbb-bbbb-bbbbbbbbbbbb'::uuid,
    'Mốc thế hệ (generationAnchorPersonId) được ánh xạ chính xác'
);

SELECT * FROM finish();
ROLLBACK;
