/* eslint-disable */
/* @formatter:off */

import MipmapElement from '../../chipper/js/browser/MipmapElement.js';

// The levels in the mipmap. Specify explicit types rather than inferring to assist the type checker, for this boilerplate case.
const mipmaps = [
  new MipmapElement( 549, 374, 'data:image/png;base64,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' ),
  new MipmapElement( 275, 187, 'data:image/png;base64,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' ),
  new MipmapElement( 138, 94, 'data:image/png;base64,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' ),
  new MipmapElement( 69, 47, 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEUAAAAvCAYAAAC14gcVAAAAAklEQVR4AewaftIAAAR4SURBVO3By1MbdQDA8e/u/rKbzYuEECCE2hcglKSi1nqxae0Dbx4o1YN/mf+C68XQmTR2quOM40zpg8fBSscZR2B0SmgTAgnNY/fn9JzWWULCXvL5KN/+IitAGA8Zrx4TaP5FOXINaSbwkoSfVfraqPS1Uelro9LXRqWvjUpfG8EJcBwbx27xLrpj84bdauI06/SCqglUVcMNQY+ZVLlxwSY+YPAuq6uwuQlffgjxOF238vQpv25GiSRncEPQQ+Nmmc8zJqY/yP/RNI03fD4fhmHQLfV6nXw+z+rqKqGZr3FL0APSbvLp+AEfTERRFAUv7Lx4wXeWxcuXL5H+UfwDY7gl6DKTKjfTkmQihheklKytrbG0tIRt22iJywzP3EQTOm4JuihllrmeNjFNAy/U63Xu3bvHysoKUvERfH+BaGqWoxJ0gbSbXE4dMDcZRVEUjiqVStFoNBgYGKBTOzs7WJbF7u4u0j9KPHMHfzhOJwTH5KfKrbQkmYjRqWQySTKZpFNra2vkcjls20ZLXGJ4eh7Np9MpwTGk/GWuZ0xM08ALjUaDfD7PysoKEkFwapHoeJrjEnRA2k0+GdtnbjKKqqp4oVgsYlkWxWIRaYwwePEOZniIbhAckV9WuTnrMDY8iFfW19fJ/ZCjZbfQEpcYnp5H8+l0i+AIxowS1y8GCJgGXmg0GhQKBZ48eYJEEJy6TXQ8Q7cJXArX/mB6zMe//5TwQqvZ5MFPDygWi0hjhMHMImYkQS8IXDLkPltbNbxSLpXY2dlBG/qY4Zkv0Hw6vSJw6bDlQ3st8Eq1ZRKYvE30VIZeE7hUHZijioeCEOVkqPS1UelrIzgBTquJY9fxkqIZaMKHG4Ieiyj73PpIJR4N4QXHcXj48CG/bcYIJ6dxQ9AjUkomwmWupEPoug8vVKtVcrkcz58/Jzj9FW4JekCx61w5c8jM2Rhe2dra4nvLorK/jwycxoydwi1Bl4XVA+YzCvFYFC84jsPy8jKFQgHHkejjV4lPZFE1DbcEXSKl5Hy4TDYdQtd9eKFarbK0tMTGxgaO4ieSXiQ8cp6jEnSDXSd75pCZszG8sr29jWVZVCoVZOA0Q5kFjECETgiOKawcMD+nEI9F8YLjOCwvL1MoFHAciZ7KEp+8iqppdErQISkl58NlsukQuu7DC7VajVwux8bGBo7iJ5y+TWRkguMSdMKuc+X0IRfOxfDK9vY2lmVRqVSQgfcYyixgBAboBsERhZQD5ucUhmJRvCCl5NGjR+TzeRxHoqeyxCezqJqgWwQuSSk5FyqRzYQxdB9eqNVq3L17l2fPnmErBpHZRSKjE3SbwKXY6985O2aw9fcrvFBvNLh//0f29vaQ5ikSmQWMYJReELgknBpb27t4pVwqUS6XEcnPGJq6hqoJekXgUtUOwGt6QmntoclDWtogqDpvc+AohC58Q2R0kl4TuHQYmeWQ3jBePSbQLFGOTCHNBG8VhAgnQ6WvjUpfG5W+Nip9bVT62ghgHQjgJWkHAR1pHwBNvPXnf/FXi+bsoZoBAAAAAElFTkSuQmCC' ),
  new MipmapElement( 35, 24, 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACMAAAAYCAYAAABwZEQ3AAAAAklEQVR4AewaftIAAAJLSURBVM3BTWvTYADA8X+ePEvarIeuKWObnXsBy7YKjs6JR+0O+hUUBn4fP4F+huFKq3jxoNCxF4SheNVKddQhbGVb14QmeTwNpKQvyS77/bRXn5QDmMSkd5oYbpNOush1KHgpuEEEN4gkIqUUKvC5IoIApQIC32NUmtDRNI1ekghM4VHKe0xnJFeOj6HZhNVVhgqCgL3dXb60C5ipLL0kI5qyXEoFQSqZ4H9CCIQQSCkZ5OLigmqlQv3cJpNPE0YyhFIBxRmX4qKJrgt6GYaBZVkM0mg02HpTQU1vkF1eph/JAKbwKOU9ZieT9GPbNrZtEyYIAvb39/lQ+0a68BwzlWEQSR9TSYdSQSdlJYij3W5TrVb50UqTXXuBLscYRhIiZxzzYEHSdQWnLpG1TltsV96hpktkV1YYlSREt1Xn82GXuH4enTKWf4aZsolCEuLYesh1iEUwiU4SkVIByve4Dk2XaJqglySCpOiyseQzk00Qh+/71Go1vrYLmKksvSQjyqUcHq1IrESCOM7OziiXyxy5OSbuTBBGMowKWM+53FswEUIQR71eZ2v7LfrsU+z5O/QjGSApumwsBcxkk8Th+z47Ozt8PPhO5u4mhpVmEEkft8YdHhckVsIkjvPzc8rlMr+dGSbXNhG6ZBhJiNvGH+7PjeFcajiXRHZyckK58h4x+wR7Ls+oJCE6rV8cHHYZifLQlIcSCa40mi0Sy5sY42mikIT4a60zKr3TxHCbdNJFroh5MIhOcIMIbhAJvAYkcSlfojwJOFzP3j9IQsBxPatUlgAAAABJRU5ErkJggg==' )
];

export default mipmaps;