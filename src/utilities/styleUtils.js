export const getDepartmentClassName = (department) => {
  if (!department) return "default";

  switch (department) {
    case "IT":
      return "IT";
    case "Design":
      return "design";
    case "Development":
      return "development";
    case "Product":
      return "product";
    case "Finance":
      return "finance";
    case "Analytics":
      return "analytics";
    case "Marketing":
      return "marketing";
    case "Legal":
      return "legal";
    case "Human resources":
      return "HR";
    default:
      return "default";
  }
};
