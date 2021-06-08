import LexDAOLogo from './assets/lex-dao.png';

export const CONFIG = {
  INFURA_ID: process.env.REACT_APP_INFURA_ID,
  IPFS_ENDPOINT: 'https://ipfs.infura.io',
  BOX_ENDPOINT: 'https://ipfs.3box.io',
  NETWORK_CONFIG: {
    100: {
      SUBGRAPH: 'dan13ram/xdai-smart-invoices',
      WRAPPED_NATIVE_TOKEN: '0xe91D153E0b41518A2Ce8Dd3D7944Fa863463a97d'.toLowerCase(),
      INVOICE_FACTORY: '0x26832d296Be653C1A818B7AaF3D4e5e16A0C314d'.toLowerCase(),
      RESOLVERS: {
        ['0x034CfED494EdCff96f0D7160dC2B55Cae5Ee69E1'.toLowerCase()]: {
          name: 'LexDAO',
          logoUrl: LexDAOLogo,
          termsUrl:
            'https://github.com/lexDAO/Arbitration/blob/master/rules/ToU.md#lexdao-resolver',
        },
      },
    },
    4: {
      SUBGRAPH: 'dan13ram/rinkeby-smart-invoices',
      WRAPPED_NATIVE_TOKEN: '0xc778417E063141139Fce010982780140Aa0cD5Ab'.toLowerCase(),
      INVOICE_FACTORY: '0x9c94f17C4B7A8E2a75A83466c9F9745a0D9F7e1c'.toLowerCase(),
      RESOLVERS: {
        ['0x1206b51217271FC3ffCa57d0678121983ce0390E'.toLowerCase()]: {
          name: 'LexDAO',
          logoUrl: LexDAOLogo,
          termsUrl:
            'https://github.com/lexDAO/Arbitration/blob/master/rules/ToU.md#lexdao-resolver',
        },
      },
    },
  },
};
