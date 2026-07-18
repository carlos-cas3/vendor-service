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
      name: "List all vendors",
      engine: "http",
      flow: [{ get: { url: "/api/vendors" } }],
    },
  ],
};
