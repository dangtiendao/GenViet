export interface GedcomIndividual {
  id: string; // @I1@
  name: string;
  gender?: "M" | "F" | "U";
  birthDate?: string;
  deathDate?: string;
  familyChildId?: string; // @F1@
  familySpouseIds: string[]; // [@F1@]
}

export interface GedcomFamily {
  id: string; // @F1@
  husbandId?: string;
  wifeId?: string;
  childrenIds: string[];
}

export interface GedcomParseResult {
  version: string;
  encoding: string;
  individuals: GedcomIndividual[];
  families: GedcomFamily[];
  unsupportedTags: string[];
}

/**
 * Phân tích tệp GEDCOM tiêu chuẩn (Spike Prototype - P27-T12)
 */
export function parseGedcomText(text: string): GedcomParseResult {
  const individuals: GedcomIndividual[] = [];
  const families: GedcomFamily[] = [];
  const unsupportedTags: string[] = [];

  const lines = text.split(/\r?\n/);
  let currentIndi: GedcomIndividual | null = null;
  let currentFam: GedcomFamily | null = null;

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) continue;

    const parts = line.split(/\s+/);
    if (parts.length < 2) continue;

    let id: string | undefined;
    let tag: string;
    let value: string;

    if (parts[1].startsWith("@") && parts[1].endsWith("@")) {
      id = parts[1];
      tag = parts[2];
      value = parts.slice(3).join(" ");
    } else {
      id = undefined;
      tag = parts[1];
      value = parts.slice(2).join(" ");
    }

    if (tag === "INDI") {
      if (currentFam) {
        families.push(currentFam);
        currentFam = null;
      }
      if (currentIndi) {
        individuals.push(currentIndi);
      }
      currentIndi = { id: id || `@I${individuals.length + 1}@`, name: "", familySpouseIds: [] };
    } else if (tag === "FAM") {
      if (currentIndi) {
        individuals.push(currentIndi);
        currentIndi = null;
      }
      if (currentFam) {
        families.push(currentFam);
      }
      currentFam = { id: id || `@F${families.length + 1}@`, childrenIds: [] };
    } else if (tag === "TRLR") {
      if (currentIndi) {
        individuals.push(currentIndi);
        currentIndi = null;
      }
      if (currentFam) {
        families.push(currentFam);
        currentFam = null;
      }
    } else if (currentIndi) {
      if (tag === "NAME") currentIndi.name = value.replace(/\//g, "").trim();
      if (tag === "SEX") currentIndi.gender = value.trim() as any;
    } else if (currentFam) {
      if (tag === "HUSB") currentFam.husbandId = value.trim();
      if (tag === "WIFE") currentFam.wifeId = value.trim();
      if (tag === "CHIL") currentFam.childrenIds.push(value.trim());
    }
  }

  if (currentIndi) individuals.push(currentIndi);
  if (currentFam) families.push(currentFam);

  return {
    version: "5.5.1",
    encoding: "UTF-8",
    individuals,
    families,
    unsupportedTags,
  };
}
