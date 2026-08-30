BEGIN;
SELECT plan(15);

-- 1. Kiểm tra bảng audit_logs tồn tại
SELECT has_table('public', 'audit_logs', 'Bảng public.audit_logs phải tồn tại');

-- 2. Kiểm tra các cột chính
SELECT has_column('public', 'audit_logs', 'id', 'Có cột id');
SELECT has_column('public', 'audit_logs', 'tree_id', 'Có cột tree_id');
SELECT has_column('public', 'audit_logs', 'actor_user_id', 'Có cột actor_user_id');
SELECT has_column('public', 'audit_logs', 'entity_type', 'Có cột entity_type');
SELECT has_column('public', 'audit_logs', 'entity_id', 'Có cột entity_id');
SELECT has_column('public', 'audit_logs', 'action_type', 'Có cột action_type');
SELECT has_column('public', 'audit_logs', 'before_data', 'Có cột before_data');
SELECT has_column('public', 'audit_logs', 'after_data', 'Có cột after_data');
SELECT has_column('public', 'audit_logs', 'changed_fields', 'Có cột changed_fields');
SELECT has_column('public', 'audit_logs', 'created_at', 'Có cột created_at');

-- 3. Kiểm tra các index chính
SELECT has_index('public', 'audit_logs', 'idx_audit_logs_tree_created', 'Có index (tree_id, created_at, id)');
SELECT has_index('public', 'audit_logs', 'idx_audit_logs_tree_entity', 'Có index (tree_id, entity_type, entity_id)');
SELECT has_index('public', 'audit_logs', 'idx_audit_logs_tree_action', 'Có index (tree_id, action_type)');
SELECT has_index('public', 'audit_logs', 'idx_audit_logs_tree_actor', 'Có index (tree_id, actor_user_id)');

SELECT * FROM finish();
ROLLBACK;
