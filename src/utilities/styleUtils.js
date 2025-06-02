export const getDepartmentClassName = (department) => {
  if (!department) return "default";

  switch (department) {
    case "Design":
      return "design";
    case "Development":
      return "development";
    case "Product":
      return "product";
    case "Finance":
      return "finance";
    case "Marketing":
      return "marketing";
    case "Sales":
      return "sales";
    case "Analytics":
      return "analytics";
    case "IT":
      return "IT";
    case "Legal":
      return "legal";
    case "Human Resources":
      return "HR";
    default:
      return "default";
  }
};
