import { getImageURL } from "../app"

describe('Test, the function "getImageURL()" should exist' , () => {
    test('It should return true', async () => {
        expect(getImageURL).toBeDefined();
    });
});
