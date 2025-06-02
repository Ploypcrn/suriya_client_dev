import _ from 'lodash';
import { useSelector } from "react-redux";
import { authorizeSelector } from "../redux/store/authorizeSelector";

export class AuthUtils {
  static checkPermission(permissionList, permission) {
    return _.includes(permissionList, permission);
  }

  static useCheckPermission = (permissionList) => (permission) => {
    return _.includes(permissionList, permission);
  };

  static checkApprove(permission) {
    const permissionList = useSelector(authorizeSelector);

    return _.includes(
      permissionList.permissionsList,
      permission.concat(":APPROVE")
    );
  }
}
