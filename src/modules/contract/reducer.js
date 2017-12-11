export const initialState = {
  data: {
    duration: 94747086,
    cliff: 1502961714,
    beneficiary: "0xd11a019a70986bd607cbc1c1f9ae221c78581f49",
    terraformReserve: "0xcca95e580bbbd04851ebfb85f77fd46c9b91f11c",
    returnVesting: "0x79c1fdaba012b9a094c495a86ce5c6199cf86368",
    vestedAmount: 2543057747586010191384672,
    releasableAmount: 85832527982390930735327,
    revoked: false,
    revocable: false,
    owner: "0x55ed2910cc807e4596024266ebdf7b1753405a11",
    released: 2457225219603619260649345,
    start: 1502961714,
    token: "0x0f5d2fb29fb7d3cfee444a200298f468908cc942"
  },
  loading: false,
  error: null
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    default:
      return state;
  }
}
