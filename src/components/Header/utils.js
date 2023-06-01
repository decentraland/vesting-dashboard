const DEFAULT_AVATAR = 'https://decentraland.org/images/male.png'

export const createDefaultProfile = (address) => ({
  userId: address,
  ethAddress: address,
  hasClaimedName: false,
  avatar: {
    snapshots: {
      face: DEFAULT_AVATAR,
      face128: DEFAULT_AVATAR,
      face256: DEFAULT_AVATAR,
      body: '',
    },
    bodyShape: 'dcl://base-avatars/BaseMale',
    eyes: {
      color: {
        r: 0.125,
        g: 0.703125,
        b: 0.96484375,
      },
    },
    hair: {
      color: {
        r: 0.234375,
        g: 0.12890625,
        b: 0.04296875,
      },
    },
    skin: {
      color: {
        r: 0.94921875,
        g: 0.76171875,
        b: 0.6484375,
      },
    },
    wearables: [
      'dcl://base-avatars/green_hoodie',
      'dcl://base-avatars/brown_pants',
      'dcl://base-avatars/sneakers',
      'dcl://base-avatars/casual_hair_01',
      'dcl://base-avatars/beard',
    ],
    version: 0,
  },
  name: '',
  email: '',
  description: '',
  blocked: [],
  inventory: [],
  version: 0,
  tutorialStep: 0,
  isDefaultProfile: true,
})

export async function getDclProfile(address) {
  try {
    const response = await fetch(`https://peer.decentral.io/lambdas/profiles?id=${address}`)
    const profileResponse = await response.json()

    if (profileResponse.length > 0) {
      const profileData = profileResponse[0].avatars[0]
      const snapshots = profileData.avatar.snapshots
      const face256 = snapshots.face256

      if (face256) {
        profileData.avatar.snapshots = {
          ...snapshots,
          face: face256,
          face128: face256,
        }
      }

      return profileData
    }
  } catch (error) {
    console.error('Error fetching profile', error)
  }

  return createDefaultProfile(address)
}
