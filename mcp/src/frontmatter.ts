export interface SkillFrontmatter {
  name?: string;
  description?: string;
}

export function parseSkillFrontmatter(content: string): SkillFrontmatter {
  const match = content.match(/^---\s*\r?\n([\s\S]*?)\r?\n---/);
  if (!match?.[1]) {
    return {};
  }

  const yaml = match[1];
  const frontmatter: SkillFrontmatter = {};
  const name = parseScalar(yaml, "name");
  const description = parseDescription(yaml);

  if (name) {
    frontmatter.name = name;
  }
  if (description) {
    frontmatter.description = description;
  }

  return frontmatter;
}

function parseScalar(yaml: string, key: string): string | undefined {
  const match = yaml.match(new RegExp(`^${key}:\\s*(.+?)\\s*$`, "m"));
  if (!match?.[1]) {
    return undefined;
  }

  const raw = match[1].trim();
  if (["|-", "|", ">-", ">"].includes(raw)) {
    return undefined;
  }

  return cleanYamlScalar(raw);
}

function parseDescription(yaml: string): string | undefined {
  const block = yaml.match(/^description:\s*[>|]-?\s*\r?\n((?:[ \t]+.*\r?\n?)+)/m);
  if (block?.[1]) {
    return block[1]
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean)
      .join(" ")
      .replace(/\s+version:\s+\S+.*$/, "")
      .trim();
  }

  return parseScalar(yaml, "description");
}

function cleanYamlScalar(value: string): string {
  const trimmed = value.trim();
  const quote = trimmed[0];
  const unquoted =
    (quote === `"` || quote === `'`) && trimmed.endsWith(quote)
      ? trimmed.slice(1, -1)
      : trimmed;

  return unquoted
    .replaceAll("\\u2019", "’")
    .replaceAll("\\u201c", "“")
    .replaceAll("\\u201d", "”")
    .replace(/\s+/g, " ")
    .trim();
}
