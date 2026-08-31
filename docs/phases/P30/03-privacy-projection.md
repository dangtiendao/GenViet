# P30: Privacy Projection Specification

## 1. DTO Field Allowlisting
- `PublicTreeDto`: `id`, `slug`, `name`, `description`, `rootPersonId`, `generationAnchorPersonId`, `publicationVersion`, `privacyProjectionVersion`, `searchEngineVisibility`, `livingPersonPolicy`.
- `PublicPersonDto`: `id`, `displayName`, `gender`, `livingState`, `birthYear`, `deathYear`, `isEstimated`, `isCenter`, `publicThumbnail`, `visibility`.
- Stripped fields: `birth_date`, `birth_place_text`, `death_place_text`, `hometown_text`, `burial_place_text`, `occupation_text`, `biography`, `avatar_path`, `created_by`, `updated_by`, `deleted_by`, internal account links, notes.

## 2. Redaction Rules
- Living persons or unknown living status: `visibility: "PUBLIC_REDACTED"`, `birthDate` omitted, `deathYear` null, `publicThumbnail` null.
- Under `STRICT` policy: `displayName` replaced with "Thành viên gia đình", `birthYear` omitted.
