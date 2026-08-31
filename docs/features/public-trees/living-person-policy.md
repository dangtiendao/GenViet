# Living Person Privacy Policy

## 1. Conservative Principle
In accordance with P02 Domain Analysis and P30 requirements, living individuals are protected against unwanted exposure on public networks:

| Field | Living Person (REDACTED) | Living Person (STRICT) | Deceased Person |
| :--- | :--- | :--- | :--- |
| Full Name | Displayed (or generic fallback) | "Thành viên gia đình" | Full Name |
| Birth Date | Year only (Full date hidden) | Hidden (NULL) | Exact Date / Year |
| Death Date | NULL | NULL | Exact Date / Year |
| Contact Info | Hidden (NULL) | Hidden (NULL) | Hidden (NULL) |
| Biography | Hidden (NULL) | Hidden (NULL) | Public Biography |
| Avatar | Hidden (NULL) | Hidden (NULL) | Public Thumbnail |

## 2. Unknown Living Status Fallback
If an individual's `living_status` is `unknown`, the system treats the individual conservatively as **LIVING** to prevent accidental disclosure.
