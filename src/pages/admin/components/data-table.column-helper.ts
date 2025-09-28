import type { Column } from "./data-table.types";

export function getColumnTypeFromKey(key: string): Column["type"] {
	  if (key.endsWith("_at") || key === "date") return "date";
	  if (key.endsWith("_id")) return "number";
	  if (key === "image_url") return "image"
	  if (key === "key" || key === "name" || key === "title" || key === "description") return "text";
	  if (key === "email") return "email";
	  if (key === "url") return "url";
	  return "text";
}