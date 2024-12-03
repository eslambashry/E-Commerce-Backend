import { systemRoles } from "../../utilities/systemRole.js";

export const couponEndpoints = {
    CREATE_COUPON: [systemRoles.ADMIN,systemRoles.SUPER_ADMIN],
    DELETE_COUPON: [systemRoles.ADMIN,systemRoles.SUPER_ADMIN]

}