module.exports = {
  config: {
    target: "http://localhost:3001",
    phases: [
      { duration: 30,  arrivalRate: 5,               name: "warm_up" },
      { duration: 60,  arrivalRate: 10, rampTo: 100, name: "stress_ramp" },
      { duration: 60,  arrivalRate: 100, rampTo: 200, name: "stress_ramp_2" },
      { duration: 60,  arrivalRate: 200,             name: "stress_peak" },
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
