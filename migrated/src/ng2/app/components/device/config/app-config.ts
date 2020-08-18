import { environment } from './../../../../environments/environment';

const BASE_URL = environment.apiUrl;
const DEVICE = 'devices';
const API_V2 = 'v2'

export const CONFIG = {
  EncrDecrKey: '123456$#@$^@1ERF',
  // oauth
  userAuthURL: BASE_URL + DEVICE + '/get_auth_token',
  getDevicesByCompanyURL: BASE_URL + DEVICE + '?companyId=',
  getCurrentUserURL: BASE_URL + 'users/current',
  getCurrentCompanyURL: BASE_URL + 'company/current',

  // HARDWARE
  getAllHardwareListURL: BASE_URL + DEVICE + '/report?companyId=',
  getVirusInfoURL: BASE_URL + DEVICE + '/extended?companyId=',

  // SOFTWARE
  getAllSoftwareListURL: BASE_URL + DEVICE + '/get_hardware',
  deleteSoftwareURL: BASE_URL + DEVICE + '/get_hardware',

  // STARTUP
  getALlStartupListURL: BASE_URL + DEVICE + '/get_hardware',

  // SERVICES
  getAllServicesListURL: BASE_URL + DEVICE + '/get_hardware',

  // ANTIVIRUS
  getAllAntivirusListURL: BASE_URL + DEVICE + '/get_hardware',
  
  // TERMINAL
  getAllTerminalListURL: BASE_URL + DEVICE + '/get_hardware',

  // WINDOW UPDATE
  getAllWindowUpdateListURL: BASE_URL + DEVICE + '/get_hardware',

  // TICKET
  getAllTicketListURL: BASE_URL + 'v2/tickets/getTickets?listType=ALL',
  getActualNumberURL: BASE_URL + 'data/actualNumber?type=TICKET',
  getAllCompanyCLientURL: BASE_URL + 'company/clients',
  getAllUsersURL: BASE_URL + 'users',
  createTicketURL: BASE_URL + API_V2 + '/tickets',

  // REMOTE CONTROL
  getViewerURL: BASE_URL + 'data/connection-viewer',
  createConnectionURL: BASE_URL + 'remote/createRemoteSession?',
  getConstant: BASE_URL + 'data/getConstants',
  printPdfURL: BASE_URL + 'reports/pdf',
  saveDeviceNameURL: BASE_URL + DEVICE + '/editAgentInfo',

  // TERMINAL
  createCommandURL: BASE_URL + 'cmdCommands/create',
  updateCommandURL: BASE_URL + 'cmdCommands/edit',
  getCommandURL: BASE_URL + 'cmdCommands',
  getCmdCategoryURL: BASE_URL + 'cmdCommands/categories',
  createCategoryURL: BASE_URL + 'cmdCommands/categories/create/',
  deleteCategoryURL: BASE_URL + 'cmdCommands/categories/delete/',
  updateCategoryURL: BASE_URL + 'cmdCommands/categories/edit/',
  deleteCommandURL: BASE_URL + 'cmdCommands/delete/',

  // DASHBOARD
  overrideHardwareURL: BASE_URL + DEVICE + '/overrideHardware'
};
