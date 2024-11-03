export const sanitizeFilename = (filename) => {
    if (!filename) {
        return 'default_filename'; // Provide a default filename if undefined or null
    }

    return filename
        .replace(/[^a-z0-9]/gi, '_')  // Replace non-alphanumeric characters with underscores
        .toLowerCase();               // Convert to lowercase for consistency
};
