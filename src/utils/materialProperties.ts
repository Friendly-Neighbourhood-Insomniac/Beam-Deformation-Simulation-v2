interface MaterialInfo {
  name: string;
  properties: string[];
  description: string;
}

export function getMaterialInfo(elasticModulus: number): MaterialInfo {
  if (elasticModulus < 80) {
    return {
      name: "Aluminum Alloy",
      properties: [
        "High strength-to-weight ratio",
        "Excellent corrosion resistance",
        "Yield strength: 200-600 MPa",
        "Ductile material with good elastic recovery"
      ],
      description: "Aluminum alloys exhibit linear elastic behavior under small loads, making them ideal for lightweight structural applications."
    };
  } else if (elasticModulus < 150) {
    return {
      name: "Titanium Alloy",
      properties: [
        "Exceptional strength-to-density ratio",
        "Superior fatigue resistance",
        "Yield strength: 800-1200 MPa",
        "Excellent elastic deformation properties"
      ],
      description: "Titanium alloys combine high strength with low density, showing excellent elastic behavior and fatigue resistance."
    };
  } else if (elasticModulus < 300) {
    return {
      name: "Steel Alloy",
      properties: [
        "High tensile strength",
        "Good elastic limit",
        "Yield strength: 250-1200 MPa",
        "Predictable stress-strain behavior"
      ],
      description: "Steel alloys demonstrate excellent elastic properties with a well-defined elastic limit and predictable deformation behavior."
    };
  } else {
    return {
      name: "Tungsten Alloy",
      properties: [
        "Extremely high stiffness",
        "Outstanding wear resistance",
        "Yield strength: 1300-1600 MPa",
        "Limited elastic deformation range"
      ],
      description: "Tungsten alloys exhibit very high stiffness and strength, making them resistant to elastic deformation under load."
    };
  }
}