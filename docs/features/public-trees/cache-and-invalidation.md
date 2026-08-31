# Public Cache and Invalidation

## 1. Cache Namespace Isolation
- Public requests use cache keys with prefix `public:tree-graph:...`.
- Authenticated member caches use `tree-graph:...`.
- Cross-contamination between public and private cache entries is prevented by distinct key schemas and server-side authorization checks.

## 2. Invalidation Events
- **Tree Publish**: Generates new `publication_version`, invalidating previous versions.
- **Tree Unpublish**: Marks tree `private`, immediately preventing public graph retrieval.
- **Node Visibility Changes**: Increments publication version or triggers slug invalidation.
