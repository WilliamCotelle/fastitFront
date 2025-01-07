const services = [
  { id: "1", name: "Coiffeur Pro", location: "Paris" },
  { id: "2", name: "Cuisinier Gourmet", location: "Lyon" },
];

export const searchServices = (query) => {
  return services.filter((service) =>
    service.name.toLowerCase().includes(query.toLowerCase())
  );
};
