export const installationStatuses = {
    'INITIALIZATION': {
        status: 'Installing',
        message: "Remote installation initialized"
    },
    'CONNECT_TO_HOST': {
        status: 'Installing',
        message: 'Connecting to a remote computer'
    },
    'OPEN_SC_MANAGER': {
        status: 'Installing',
        message: 'Opening the service manager'
    },
    'OPEN_S_C_MANAGER': {
        status: 'Installing',
        message: 'Opening the service manager'
    },
    'INSTALL_CLEAN_UP': {
        status: 'Installing',
        message: 'Cleaning the previous installation'
    },
    'OPEN_DESTINATION_FOLDER': {
        status: 'Installing',
        message: 'Opening the destination folder'
    },
    'COPY_BINARY_FILES': {
        status: 'Installing',
        message: 'Copying the binary files'
    },
    'SERVICE_INSTALLATION': {
        status: 'Installing',
        message: 'Running the service'
    },
    'SERVICE_INSTALLED': {
        status: 'Installing',
        message: 'Service is installed \ started'
    },
    'BIN_DOWNLOADING': {
        status: 'Installing',
        message: 'Downloading the installer'
    },
    'INSTALLATION': {
        status: 'Installing',
        message: 'Running the installer'
    },
    'INSTALL_FINISHED': {
        status: 'Installed',
        message: 'Remote installation completed successfully'
    },
    'ERROR_USER_NAME_OR_PASS': {
        status: 'Bad password',
        message: 'Incorrect login or password'
    },
    'ERROR_INVALID_USER_NAME': {
        status: 'Bad password',
        message: 'Incorrect username'
    },
    'ERROR_HOST_OFFLINE_OR_FIREWALL': {
        status: 'Blocked',
        message: 'The remote computer is not connected to the network or is blocked by a firewall'
    },
    'ERROR_UAC': {
        status: 'Blocked',
        message: 'Enabled UAC does not allow installation'
    },
    'ERROR_INITIALIZATION': {
        status: 'Install error',
        message: 'Initialization error'
    },
    'ERROR_CONNECT_TO_HOST': {
        status: 'Install error',
        message: 'Error  connecting to a remote computer'
    },
    'ERROR_OPEN_SC_MANAGER': {
        status: 'Install error',
        message: 'Error opening service manager'
    },
    'ERROR_OPEN_S_C_MANAGER': {
        status: 'Install error',
        message: 'Error opening service manager'
    },
    'ERROR_OPEN_DESTINATION_FOLDER': {
        status: 'Install error',
        message: 'Error opening destination folder'
    },
    'ERROR_COPY_BINARY_FILES': {
        status: 'Install error',
        message: 'Error copying files'
    },
    'ERROR_SERVICE_INSTALLATION': {
        status: 'Install error',
        message: 'Error installing service'
    },
    'ERROR_BIN_DOWNLOADING': {
        status: 'Install error',
        message: 'Failed to load installer'
    },
    'ERROR_INSTALLATION': {
        status: 'Install error',
        message: 'Installation error'
    },

}