import {MasterDetailModel} from '../types';

export const convertToMasterDetailModel = (
  options: string[],
): MasterDetailModel[] => {
  return options.map((option, index) => ({
    id: index + 1,
    masterDetailName: option,
  }));
};
