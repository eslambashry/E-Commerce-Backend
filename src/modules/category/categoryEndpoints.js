import { systemRoles } from "../../utilities/systemRole.js";

export const categoryEndpoints = {
    CREATE_CATEGORY: [systemRoles.ADMIN,systemRoles.SUPER_ADMIN],
    UPDATE_CATEGORY: [systemRoles.ADMIN,systemRoles.SUPER_ADMIN],
    DELETE_CATEGORY: [systemRoles.ADMIN,systemRoles.SUPER_ADMIN]

}