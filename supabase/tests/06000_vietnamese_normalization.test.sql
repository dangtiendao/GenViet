-- ==============================================================================
-- Test Suite: 06000_vietnamese_normalization.test.sql
-- Phase: P16 (Vietnamese Search Normalization & Diacritics Removal)
-- ==============================================================================

BEGIN;
SELECT plan(8);

-- Test 1: Bỏ dấu tiếng Việt cơ bản
SELECT is(
    _system.normalize_person_name('Nguyễn Văn An'),
    'nguyen van an',
    'normalize_person_name removes Vietnamese diacritics'
);

-- Test 2: Quy đổi 'đ' và 'Đ' thành 'd'
SELECT is(
    _system.normalize_person_name('Đặng Tiến Đạo'),
    'dang tien dao',
    'normalize_person_name converts đ and Đ to d'
);

-- Test 3: Xử lý họ Đỗ và tên Đức
SELECT is(
    _system.normalize_person_name('Đỗ Minh Đức'),
    'do minh duc',
    'normalize_person_name converts Đỗ Minh Đức to do minh duc'
);

-- Test 4: Thu gọn khoảng trắng thừa, tab và newline
SELECT is(
    _system.normalize_person_name(E'   Trần   \t  Thị   \n  Ánh   '),
    'tran thi anh',
    'normalize_person_name trims and collapses multiple whitespaces, tabs, and newlines'
);

-- Test 5: Chuỗi rỗng và chuỗi chỉ có khoảng trắng
SELECT is(
    _system.normalize_person_name('     '),
    '',
    'normalize_person_name returns empty string for whitespace-only input'
);

-- Test 6: Giá trị NULL
SELECT is(
    _system.normalize_person_name(NULL),
    '',
    'normalize_person_name returns empty string for NULL'
);

-- Test 7: Ký tự hoa thường kết hợp (Mixed Case)
SELECT is(
    _system.normalize_person_name('HoÀnG qUốC vIệT'),
    'hoang quoc viet',
    'normalize_person_name converts mixed case with diacritics to lowercase ASCII'
);

-- Test 8: Tên có phụ âm ghép đặc biệt
SELECT is(
    _system.normalize_person_name('Lý Thái Tổ'),
    'ly thai to',
    'normalize_person_name converts Lý Thái Tổ correctly'
);

SELECT * FROM finish();
ROLLBACK;
