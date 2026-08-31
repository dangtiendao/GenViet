# Public Trees API Specification

## 1. Endpoints

### `GET /api/public/trees/[slug]`
- **Description**: Returns allowlisted summary metadata for a public family tree.
- **Parameters**: `slug` (string in path)
- **Response**: `200 OK` with `PublicTreeDto` or `404 Not Found`.

### `GET /api/public/trees/[slug]/graph`
- **Description**: Returns a public graph slice around the center person with paternal-line traversal and redacted living data.
- **Query Parameters**:
  - `centerPersonId` (UUID, optional)
  - `ancestorDepth` (integer 0-5, default 2)
  - `descendantDepth` (integer 0-5, default 2)
  - `includeSpouses` (boolean, default true)
  - `descendantTraversalMode` (string: `PATERNAL_LINE` | `ALL_DESCENDANTS`, default `PATERNAL_LINE`)
- **Response**: `200 OK` with `PublicGraphDto` and `X-Public-Graph-Cache-Key` header.

### `GET /api/public/trees/[slug]/person/[personId]`
- **Description**: Returns allowlisted redacted profile information for a person within a public tree.
- **Parameters**: `slug` (string), `personId` (UUID)
- **Response**: `200 OK` with `PublicPersonProfileDto`.
