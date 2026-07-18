module.exports = {
  config: {
    target: "http://localhost:3001",
    phases: [
      { duration: 30, arrivalRate: 1, name: "warm_up" },
      { duration: 60, arrivalRate: 5, rampTo: 30, name: "ramp_up" },
      { duration: 120, arrivalRate: 30, name: "sustained" },
    ],
  },
  scenarios: [
    {
      name: "Create branch",
      engine: "http",
      flow: [
        {
          get: {
            url: "/api/vendors",
            capture: { json: "$.data[0].vendor_id", as: "vendorId" },
          },
        },
        {
          post: {
            url: "/api/vendors/{{ vendorId }}/branches",
            json: {
              city_id: 1,
              branch_name: "Sucursal Load Test",
              branch_address: "Av. Prueba 123",
            },
          },
        },
      ],
    },
  ],
};
