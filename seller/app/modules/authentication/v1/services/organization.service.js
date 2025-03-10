import { v1 as uuidv1 } from 'uuid';
import MESSAGES from '../../../../lib/utils/messages';
import Organization from '../../models/organization.model';
import User from '../../models/user.model';
import UserService from "./user.service";
import {
    NoRecordFoundError,
    DuplicateRecordFoundError,
    BadRequestParameterError,
} from '../../../../lib/errors';
import s3 from "../../../../lib/utils/s3Utils";

//import axios from 'axios';
//import ServiceApi from '../../../../lib/utils/serviceApi';

const userService = new UserService()
class OrganizationService {
    async create(data) {
        try {
            let query = {};

            let orgDetails = data.providerDetails;
            const organizationExist = await Organization.findOne({name:orgDetails.name});

            if (organizationExist) {
                throw new DuplicateRecordFoundError(MESSAGES.ORGANIZATION_ALREADY_EXISTS);
            }

            let userExist = await User.findOne({email:data.user.email})

            if (userExist) {
                throw new DuplicateRecordFoundError(MESSAGES.USER_ALREADY_EXISTS);
            }

            let  organization = new Organization(orgDetails);
            let savedOrg = await organization.save();

            //create a user
            let user = await userService.create({...data.user,organization:organization._id,role:"Organization Admin"})

            return {user:user,providerDetail:organization};

        } catch (err) {
            console.log(`[OrganizationService] [create] Error in creating organization ${data.organizationId}`,err);
            throw err;
        }
    }


    async signup(data) {
        try {
            let query = {};

            let orgDetails = data.providerDetails;
            const organizationExist = await Organization.findOne({name:orgDetails.name});

            if (organizationExist) {
                throw new DuplicateRecordFoundError(MESSAGES.ORGANIZATION_ALREADY_EXISTS);
            }

            let userExist = await User.findOne({email:data.user.email});

            if (userExist) {
                throw new DuplicateRecordFoundError(MESSAGES.USER_ALREADY_EXISTS);
            }

            let  organization = new Organization(orgDetails);
            let savedOrg = await organization.save();

            //create a user
            let user = await userService.signup({...data.user,organization:organization._id,role:'Organization Admin'});

            return {user:user,providerDetail:organization};

        } catch (err) {
            console.log(`[OrganizationService] [create] Error in creating organization ${data.organizationId}`,err);
            throw err;
        }
    }
    // async list(params, organizationId,queryData) {
    //     try {
    //         let query={};
    //         // if(params.name){
    //         //     query.name = { $regex: params.name, $options: 'i' };
    //         // }
            
    //         const organizations = await Organization.find(query).sort({createdAt:1}).skip(queryData.offset).limit(queryData.limit);
    //         const count = await Organization.count(query)
    //         let organizationData={
    //             count,
    //             organizations
    //         };
    //         return organizationData;
    //     } catch (err) {
    //         console.log('[ProductService] [getAll] Error in getting all organization ',err);
    //         throw err;
    //     }
    // }
    async list(organizationId, offset, limit) {
        try {
          const query = {};
          // Uncomment the following lines if you want to search by organization name
          // if (params.name) {
          //     query.name = { $regex: params.name, $options: 'i' };
          // }
      
          const count = await Organization.countDocuments(query);
          const organizations = await Organization.find(query)
          .select('address name contactEmail contactMobile FSSAI')
            .sort({ createdAt: 1 })
            .skip(offset)
            .limit(limit);
      
          const organizationData = {
            count,
            organizations,
          };
      
          return organizationData;
        } catch (err) {
          console.log("[ProductService] [list] Error in getting all organizations", err);
          throw err;
        }
      }

    async get(organizationId) {
        try {
            let doc = await Organization.findOne({_id:organizationId}).lean();

            //console.log("organization----->",organization)
            let user = await User.findOne({organization:organizationId},{password:0})
            if (doc) {
                {
                    let idProof = await s3.getSignedUrlForRead({path:doc.idProof});
                    doc.idProof =idProof

                    let addressProof = await s3.getSignedUrlForRead({path:doc.addressProof});
                    doc.addressProof =addressProof

                    let cancelledCheque = await s3.getSignedUrlForRead({path:doc.bankDetails.cancelledCheque});
                    doc.bankDetails.cancelledCheque =cancelledCheque

                    let PAN = await s3.getSignedUrlForRead({path:doc.PAN.proof});
                    doc.PAN.proof =PAN

                    let GSTN = await s3.getSignedUrlForRead({path:doc.GSTN.proof});
                    doc.GSTN.proof =GSTN

                    if(doc.storeDetails){
                        let logo = await s3.getSignedUrlForRead({path:doc.storeDetails?.logo});
                        doc.storeDetails.logo =logo
                    }
                }

                return {user:user,providerDetail:doc};
            } else {
                throw new NoRecordFoundError(MESSAGES.ORGANIZATION_NOT_EXISTS);
            }
        } catch (err) {
            console.log(`[OrganizationService] [get] Error in getting organization by id - ${organizationId}`,err);
            throw err;
        }
    }

    async setStoreDetails(organizationId,data) {
        try {
            let organization = await Organization.findOne({_id:organizationId})//.lean();
            if (organization) {
                organization.storeDetails =data;
                organization.save();
            } else {
                throw new NoRecordFoundError(MESSAGES.ORGANIZATION_NOT_EXISTS);
            }
            return data;
        } catch (err) {
            console.log(`[OrganizationService] [get] Error in getting organization by id - ${organizationId}`,err);
            throw err;
        }
    }

    async update(organizationId,data) {
        try {
            let organization = await Organization.findOne({_id:organizationId});//.lean();
            if (organization) {

                let userExist = await User.findOne({mobile:data.user.mobile,organization:organizationId});

                if (userExist && userExist.organization !==organizationId ) {
                    throw new DuplicateRecordFoundError(MESSAGES.USER_ALREADY_EXISTS);
                }
                else{
                    const updateUser  = await User.findOneAndUpdate({organization:organizationId},data.user);
                }

                let updateOrg = await Organization.findOneAndUpdate({_id:organizationId},data.providerDetails);

            } else {
                throw new NoRecordFoundError(MESSAGES.ORGANIZATION_NOT_EXISTS);
            }
            return data;
        } catch (err) {
            console.log(`[OrganizationService] [get] Error in getting organization by id - ${organizationId}`,err);
            throw err;
        }
    }

    async getStoreDetails(organizationId,data) {
        try {
            let organization = await Organization.findOne({_id:organizationId},{storeDetails:1}).lean();
        
            if (organization) {

                if(organization?.storeDetails){
                    let logo = await s3.getSignedUrlForRead({path:organization?.storeDetails?.logo});
                    organization.storeDetails.logo = logo
                    console.log('logo from getstore ---->' + logo)
                }else{
                    organization.storeDetails = {}
                }
               
                return organization;
            } else {
                throw new NoRecordFoundError(MESSAGES.ORGANIZATION_NOT_EXISTS);
            }

        } catch (err) {
            console.log(`[OrganizationService] [get] Error in getting organization by id - ${organizationId}`,err);
            throw err;
        }
    }
}
export default OrganizationService;
