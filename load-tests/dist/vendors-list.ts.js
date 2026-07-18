var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// load-tests/vendors-list.ts
var vendors_list_exports = {};
__export(vendors_list_exports, {
  config: () => config,
  scenarios: () => scenarios
});
module.exports = __toCommonJS(vendors_list_exports);
var config = {
  target: "http://localhost:3001",
  phases: [
    {
      duration: 30,
      arrivalRate: 1,
      name: "warm_up"
    },
    {
      duration: 60,
      arrivalRate: 5,
      rampTo: 30,
      name: "ramp_up"
    },
    {
      duration: 120,
      arrivalRate: 30,
      name: "sustained"
    }
  ]
};
var scenarios = [
  {
    name: "List all vendors",
    engine: "http",
    flow: [
      { get: { url: "/api/vendors" } }
    ]
  }
];
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  config,
  scenarios
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vdmVuZG9ycy1saXN0LnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJpbXBvcnQgdHlwZSB7IENvbmZpZywgU2NlbmFyaW8gfSBmcm9tIFwiYXJ0aWxsZXJ5XCI7XHJcblxyXG5leHBvcnQgY29uc3QgY29uZmlnOiBDb25maWcgPSB7XHJcbiAgdGFyZ2V0OiBcImh0dHA6Ly9sb2NhbGhvc3Q6MzAwMVwiLFxyXG4gIHBoYXNlczogW1xyXG4gICAge1xyXG4gICAgICBkdXJhdGlvbjogMzAsXHJcbiAgICAgIGFycml2YWxSYXRlOiAxLFxyXG4gICAgICBuYW1lOiBcIndhcm1fdXBcIixcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIGR1cmF0aW9uOiA2MCxcclxuICAgICAgYXJyaXZhbFJhdGU6IDUsXHJcbiAgICAgIHJhbXBUbzogMzAsXHJcbiAgICAgIG5hbWU6IFwicmFtcF91cFwiLFxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgZHVyYXRpb246IDEyMCxcclxuICAgICAgYXJyaXZhbFJhdGU6IDMwLFxyXG4gICAgICBuYW1lOiBcInN1c3RhaW5lZFwiLFxyXG4gICAgfSxcclxuICBdLFxyXG59O1xyXG5cclxuZXhwb3J0IGNvbnN0IHNjZW5hcmlvczogU2NlbmFyaW9bXSA9IFtcclxuICB7XHJcbiAgICBuYW1lOiBcIkxpc3QgYWxsIHZlbmRvcnNcIixcclxuICAgIGVuZ2luZTogXCJodHRwXCIsXHJcbiAgICBmbG93OiBbXHJcbiAgICAgIHsgZ2V0OiB7IHVybDogXCIvYXBpL3ZlbmRvcnNcIiB9IH0sXHJcbiAgICBdLFxyXG4gIH0sXHJcbl07XHJcbiJdLAogICJtYXBwaW5ncyI6ICI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFFTyxJQUFNLFNBQWlCO0FBQUEsRUFDNUIsUUFBUTtBQUFBLEVBQ1IsUUFBUTtBQUFBLElBQ047QUFBQSxNQUNFLFVBQVU7QUFBQSxNQUNWLGFBQWE7QUFBQSxNQUNiLE1BQU07QUFBQSxJQUNSO0FBQUEsSUFDQTtBQUFBLE1BQ0UsVUFBVTtBQUFBLE1BQ1YsYUFBYTtBQUFBLE1BQ2IsUUFBUTtBQUFBLE1BQ1IsTUFBTTtBQUFBLElBQ1I7QUFBQSxJQUNBO0FBQUEsTUFDRSxVQUFVO0FBQUEsTUFDVixhQUFhO0FBQUEsTUFDYixNQUFNO0FBQUEsSUFDUjtBQUFBLEVBQ0Y7QUFDRjtBQUVPLElBQU0sWUFBd0I7QUFBQSxFQUNuQztBQUFBLElBQ0UsTUFBTTtBQUFBLElBQ04sUUFBUTtBQUFBLElBQ1IsTUFBTTtBQUFBLE1BQ0osRUFBRSxLQUFLLEVBQUUsS0FBSyxlQUFlLEVBQUU7QUFBQSxJQUNqQztBQUFBLEVBQ0Y7QUFDRjsiLAogICJuYW1lcyI6IFtdCn0K
