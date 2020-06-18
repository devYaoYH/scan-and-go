import React from "react";
import { waitFor } from "@testing-library/react";
import renderer from "react-test-renderer";
import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import ScanStore from "./../pages/ScanStore";
import * as utils from "./../utils";
import * as constants from "./../constants/index";
import { isWeb, microapps } from "./../constants/index";

Enzyme.configure({ adapter: new Adapter() });

describe("ScanStore UI Interaction Tests", () => {
  let mountedWrapper;
  let mockFetchJson;

  const fakeStore = {
    latitude: 12345,
    longitude: 12345,
    name: "Restaurant at the End of the Universe",
  };

  beforeAll(() => {
    mockFetchJson = jest.spyOn(utils, "fetchJson").mockImplementation(() => {
      return fakeStore;
    });
  });

  it("ScanStore Page renders correctly", () => {
    const tree = renderer.create(<ScanStore />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("ScanStore Page attempts to pull Store details", async () => {
    mountedWrapper = Enzyme.mount(<ScanStore />);
    await waitFor(() =>
      expect(mockFetchJson.mock.calls).toEqual([
        [
          "POST",
          {
            "store-id": null,
          },
          "/api/store",
        ],
      ])
    );
    mockFetchJson.mockRestore();
  });

  it("ScanStore Page Correctly adds item", async () => {
    mountedWrapper = Enzyme.mount(<ScanStore />);
    // Mock an item to return from fetchJson call
    const item = {
      barcode: "93293846",
      name: "Unassuming Otter",
      price: 20.2,
    };
    const mockApiGetItem = jest
      .spyOn(utils, "fetchJson")
      .mockImplementation(() => item);
    const testBtn = mountedWrapper.find("#testScanBtn").last();
    console.log(testBtn.html());
    testBtn.simulate("click");
    await waitFor(() =>
      expect(mockApiGetItem.mock.calls).toEqual([
        [
          "POST",
          {
            "store-id": null,
          },
          "/api/store",
        ],
        [
          "POST",
          {
            "merchant-id": "",
            barcode: [item["barcode"]],
          },
          "/api/item/list",
        ],
      ])
    );
    mockApiGetItem.mockRestore();
  });
});
