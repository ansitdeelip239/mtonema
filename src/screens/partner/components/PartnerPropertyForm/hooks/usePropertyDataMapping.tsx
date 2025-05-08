import {useMemo} from 'react';
import {PartnerPropertyFormType} from '../../../../../schema/PartnerPropertyFormSchema';

export const usePropertyDataMapping = (propertyData: any) => {
  return useMemo<PartnerPropertyFormType>(
    () => ({
      isFeatured: propertyData?.featured ?? null,
      sellerType: propertyData?.sellerType as string,
      location: propertyData?.location as string,
      city: propertyData?.city as string,
      zipCode: propertyData?.zipCode ?? null,
      propertyName: propertyData?.propertyName as string,
      price: propertyData?.price as number,
      propertyFor: propertyData?.propertyFor as string,
      propertyType: propertyData?.propertyType as string,
      imageURL: propertyData?.imageURL ?? null,
      videoURL: propertyData?.videoURL ?? null,
      shortDescription: propertyData?.shortDescription ?? null,
      longDescription: propertyData?.longDescription ?? null,
      readyToMove: propertyData?.readyToMove ?? null,
      furnishing: propertyData?.furnishing ?? null,
      parking: propertyData?.parking ?? null,
      propertyAge: propertyData?.propertyAge ?? null,
      facing: propertyData?.facing ?? null,
      tags: propertyData?.tags ?? null,
      alarmSystem: propertyData?.alarmSystem ?? null,
      surveillanceCameras: propertyData?.surveillanceCameras ?? null,
      gatedSecurity: propertyData?.gatedSecurity ?? null,
      ceilingHeight: propertyData?.ceilingHeight ?? null,
      pantry: propertyData?.pantry ?? null,
      boundaryWall: propertyData?.boundaryWall ?? null,
      constructionDone: propertyData?.constructionDone ?? null,
      bhkType: propertyData?.bhkType ?? null,
      propertyForType: propertyData?.propertyForType ?? null,
      area: propertyData?.area ?? null,
      lmUnit: propertyData?.lmUnit ?? null,
      floor: Number(propertyData?.floor) ?? null,
      openSide: propertyData?.openSide ?? null,
      lifts: propertyData?.lifts ?? null,
    }),
    [propertyData],
  );
};
