const palindrom = require("../utils/for_testing").palindrom
const average = require("../utils/for_testing").average

describe.skip("palindrom", () => {
    test("palindrom of a", () => {
        const result = palindrom("a")

        expect(result).toBe("a")
    })

    test("palindrom of react", () => {
        const result = palindrom("react")

        expect(result).toBe("tcaer")
    })

    test("palindrom of saippuakauppias", () => {
        const result = palindrom("saippuakauppias")

        expect(result).toBe("saippuakauppias")
    })
})


describe.skip("average", () => {
    test("of one value is the value itself", () => {
        expect(average([1])).toBe(1)
    })

    test("of many is calculated right", () => {
        expect(average([1, 2, 3, 4, 5, 6])).toBe(3.5)
    })

    test("of empty array is zero", () => {
        expect(average([])).toBe(0)
    })
})
