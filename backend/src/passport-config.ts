import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { findOneUser } from "./usersDao.js";
import type { PassportStatic } from "passport";

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.SECRET
};

const passportConfig = (passport: PassportStatic) => {
  passport.use(
    new JwtStrategy(opts, (jwt_payload: { id: number; }, done) => {
      if (typeof jwt_payload.id !== "number") {
        done(null, false);
      }
      findOneUser(jwt_payload.id)
        .then(user => {
          console.log(user);
          if (user) {
            done(null, user);
          } else {
            done(null, false);
          }
        }).catch(err => { console.error(err); });
    })
  );
};

export default passportConfig;
