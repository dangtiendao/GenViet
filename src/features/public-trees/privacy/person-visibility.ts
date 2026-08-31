import type { RawPersonEntity } from "./living-person-redaction";

/**
 * CUT_BRANCH Policy Implementation (P30-T04, P30-T21)
 * Determines whether a person node or branch should be exposed publicly.
 * When a node is private, the branch cuts off cleanly without shortcutting topology.
 */
export function isPersonPubliclyVisible(person: RawPersonEntity): boolean {
  if (person.publicVisibility === "PRIVATE") {
    return false;
  }
  return true;
}
