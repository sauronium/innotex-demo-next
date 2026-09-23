export const units = ['Sportswear','Workwear & Uniforms','Protective Clothing','Technical Textiles'];
export const locations = ['Coimbatore Head Office','Tirupur Atelier','Tirupur Garment Unit','Coimbatore Garment Unit','Kinathukidavu Composites Centre','Coimbatore Central Warehouse'];
export type Scope = { unit: string; location: string };
export const defaultScope: Scope = {unit:'All units',location:'All locations'};
const legacyScopes = [
 {unit:units[0],location:locations[2]}, {unit:units[1],location:locations[3]},
 {unit:units[0],location:locations[1]}, {unit:units[2],location:locations[3]},
 {unit:units[3],location:locations[4]},
];
export function workScope(work: {id:string;unit?:string;location?:string}): Scope {
 const index=/^work-(\d+)$/.exec(work.id);const fallback=index?legacyScopes[Number(index[1])%5]:legacyScopes[0];
 return {unit:work.unit||fallback.unit,location:work.location||fallback.location};
}
export function inScope(record: Scope, scope: Scope) {
 return (scope.unit==='All units'||scope.unit===record.unit)&&(scope.location==='All locations'||scope.location===record.location);
}
export const routeRoles: Record<string,string[]> = {
 '/admin/approvals':['QUALITY','PURCHASE','STORE','PRODUCTION','SALES','FINANCE','DISPATCH'],
 '/sales':['SALES'], '/procurement':['PURCHASE','STORE','QUALITY'],
 '/manufacturing':['PRODUCTION','OPERATOR','QUALITY','PURCHASE'],
 '/job-work':['PRODUCTION','STORE','QUALITY','FINANCE'], '/quality':['QUALITY'],
 '/dispatch':['DISPATCH','STORE','SALES'], '/finance':['FINANCE'], '/admin':['ADMIN'],
 '/crm':['SALES'], '/integrations':['ADMIN','FINANCE'], '/reports':['MANAGEMENT','FINANCE','SALES'],
};
export function canOpenRoute(role:string,path:string) {
 if(['MANAGEMENT','ADMIN'].includes(role))return true;
 const match=Object.keys(routeRoles).find(prefix=>path.startsWith(prefix));
 return !match||routeRoles[match].includes(role);
}
export function canEditPLM(role:string,stage?:number) {
 if(['MANAGEMENT','ADMIN'].includes(role))return true;
 if(stage===undefined)return ['SALES','PRODUCTION','QUALITY'].includes(role);
 if(stage<=2)return role==='SALES';
 if(stage===3)return role==='QUALITY';
 if(stage<=7)return ['PRODUCTION','QUALITY','OPERATOR'].includes(role);
 if(stage===8)return role==='STORE';
 return role==='DISPATCH';
}
export function canManageRolls(role:string) {return ['MANAGEMENT','ADMIN','STORE','PRODUCTION'].includes(role)}
export function canInspectRolls(role:string) {return ['MANAGEMENT','ADMIN','QUALITY'].includes(role)}
export function fixedSampleScope(path:string): Scope|null {
 if(['/sales','/procurement','/manufacturing/orders','/manufacturing/boms','/job-work','/quality','/dispatch','/finance','/reports'].some(p=>path.startsWith(p)))return {unit:units[0],location:locations[2]};
 return null;
}

export function approvalScope(request: {requiredRole:string}): Scope {
 return {unit:'Sportswear',location:request.requiredRole==='QUALITY'?'Coimbatore Central Warehouse':'Tirupur Garment Unit'};
}
export function canDecideApproval(persona:{role:string;email:string}, request:{requiredRole:string;makerRole:string;makerEmail:string;status:string},scope:Scope){
 return request.status==='PENDING' && inScope(approvalScope(request),scope) && persona.role!==request.makerRole && persona.email!==request.makerEmail && [request.requiredRole,'MANAGEMENT','ADMIN'].includes(persona.role);
}
