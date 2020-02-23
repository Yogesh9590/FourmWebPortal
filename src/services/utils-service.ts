import * as jwt from "jsonwebtoken";  // used to create, sign, and verify tokens

export let jwtTokan = (payload: any) => {
  	return(jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 36000 }));
};
