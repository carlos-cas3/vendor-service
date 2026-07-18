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

// load-tests/branches-create.ts
var branches_create_exports = {};
__export(branches_create_exports, {
  config: () => config,
  scenarios: () => scenarios
});
module.exports = __toCommonJS(branches_create_exports);
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
    name: "Create branch",
    engine: "http",
    flow: [
      {
        get: {
          url: "/api/vendors",
          capture: { json: "$.data[0].vendor_id", as: "vendorId" }
        }
      },
      {
        post: {
          url: "/api/vendors/{{ vendorId }}/branches",
          json: {
            city_id: 1,
            branch_name: "Sucursal LT {{ $randomString(5) }}",
            branch_address: "Calle {{ $randomInt(1, 9999) }}"
          }
        }
      }
    ]
  }
];
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  config,
  scenarios
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vYnJhbmNoZXMtY3JlYXRlLnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJpbXBvcnQgdHlwZSB7IENvbmZpZywgU2NlbmFyaW8gfSBmcm9tIFwiYXJ0aWxsZXJ5XCI7XHJcblxyXG5leHBvcnQgY29uc3QgY29uZmlnOiBDb25maWcgPSB7XHJcbiAgdGFyZ2V0OiBcImh0dHA6Ly9sb2NhbGhvc3Q6MzAwMVwiLFxyXG4gIHBoYXNlczogW1xyXG4gICAge1xyXG4gICAgICBkdXJhdGlvbjogMzAsXHJcbiAgICAgIGFycml2YWxSYXRlOiAxLFxyXG4gICAgICBuYW1lOiBcIndhcm1fdXBcIixcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIGR1cmF0aW9uOiA2MCxcclxuICAgICAgYXJyaXZhbFJhdGU6IDUsXHJcbiAgICAgIHJhbXBUbzogMzAsXHJcbiAgICAgIG5hbWU6IFwicmFtcF91cFwiLFxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgZHVyYXRpb246IDEyMCxcclxuICAgICAgYXJyaXZhbFJhdGU6IDMwLFxyXG4gICAgICBuYW1lOiBcInN1c3RhaW5lZFwiLFxyXG4gICAgfSxcclxuICBdLFxyXG59O1xyXG5cclxuZXhwb3J0IGNvbnN0IHNjZW5hcmlvczogU2NlbmFyaW9bXSA9IFtcclxuICB7XHJcbiAgICBuYW1lOiBcIkNyZWF0ZSBicmFuY2hcIixcclxuICAgIGVuZ2luZTogXCJodHRwXCIsXHJcbiAgICBmbG93OiBbXHJcbiAgICAgIHtcclxuICAgICAgICBnZXQ6IHtcclxuICAgICAgICAgIHVybDogXCIvYXBpL3ZlbmRvcnNcIixcclxuICAgICAgICAgIGNhcHR1cmU6IHsganNvbjogXCIkLmRhdGFbMF0udmVuZG9yX2lkXCIsIGFzOiBcInZlbmRvcklkXCIgfSxcclxuICAgICAgICB9LFxyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgcG9zdDoge1xyXG4gICAgICAgICAgdXJsOiBcIi9hcGkvdmVuZG9ycy97eyB2ZW5kb3JJZCB9fS9icmFuY2hlc1wiLFxyXG4gICAgICAgICAganNvbjoge1xyXG4gICAgICAgICAgICBjaXR5X2lkOiAxLFxyXG4gICAgICAgICAgICBicmFuY2hfbmFtZTogXCJTdWN1cnNhbCBMVCB7eyAkcmFuZG9tU3RyaW5nKDUpIH19XCIsXHJcbiAgICAgICAgICAgIGJyYW5jaF9hZGRyZXNzOiBcIkNhbGxlIHt7ICRyYW5kb21JbnQoMSwgOTk5OSkgfX1cIixcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgfSxcclxuICAgICAgfSxcclxuICAgIF0sXHJcbiAgfSxcclxuXTtcclxuIl0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUVPLElBQU0sU0FBaUI7QUFBQSxFQUM1QixRQUFRO0FBQUEsRUFDUixRQUFRO0FBQUEsSUFDTjtBQUFBLE1BQ0UsVUFBVTtBQUFBLE1BQ1YsYUFBYTtBQUFBLE1BQ2IsTUFBTTtBQUFBLElBQ1I7QUFBQSxJQUNBO0FBQUEsTUFDRSxVQUFVO0FBQUEsTUFDVixhQUFhO0FBQUEsTUFDYixRQUFRO0FBQUEsTUFDUixNQUFNO0FBQUEsSUFDUjtBQUFBLElBQ0E7QUFBQSxNQUNFLFVBQVU7QUFBQSxNQUNWLGFBQWE7QUFBQSxNQUNiLE1BQU07QUFBQSxJQUNSO0FBQUEsRUFDRjtBQUNGO0FBRU8sSUFBTSxZQUF3QjtBQUFBLEVBQ25DO0FBQUEsSUFDRSxNQUFNO0FBQUEsSUFDTixRQUFRO0FBQUEsSUFDUixNQUFNO0FBQUEsTUFDSjtBQUFBLFFBQ0UsS0FBSztBQUFBLFVBQ0gsS0FBSztBQUFBLFVBQ0wsU0FBUyxFQUFFLE1BQU0sdUJBQXVCLElBQUksV0FBVztBQUFBLFFBQ3pEO0FBQUEsTUFDRjtBQUFBLE1BQ0E7QUFBQSxRQUNFLE1BQU07QUFBQSxVQUNKLEtBQUs7QUFBQSxVQUNMLE1BQU07QUFBQSxZQUNKLFNBQVM7QUFBQSxZQUNULGFBQWE7QUFBQSxZQUNiLGdCQUFnQjtBQUFBLFVBQ2xCO0FBQUEsUUFDRjtBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUNGOyIsCiAgIm5hbWVzIjogW10KfQo=
