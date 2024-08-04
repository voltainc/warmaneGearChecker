const ItemTypeEnum = {
    Item: 0,
    Head: 1,
    Neck: 2,
    Shoulder: 3,
    Shirt: 4,
    Chest: 5,
    Waist: 6,
    Legs: 7,
    Boots: 8,
    Wrist: 9,
    Hands: 10,
    Ring: 11,
    Trinket: 12,
    OneHand: 13,
    OffHand: 14,
    Bow: 15,
    Cloak: 16,
    TwoHand: 17,
    Container: 18,
    Tabard: 19,
    Chest: 20,
    MainHand: 21,
    OffHand: 22,
    HeldInOffHand: 23,
    Ammo: 24,
    Thrown: 25,
    Crossbow: 26,
    Relic: 28
}

function ItemTypeEnumToString(value) {
    for (let key in ItemTypeEnum) {
        if (ItemTypeEnum[key] === value) {
            return key;
        }
    }

    return "Unknown";
}

module.exports = { ItemTypeEnum, ItemTypeEnumToString }