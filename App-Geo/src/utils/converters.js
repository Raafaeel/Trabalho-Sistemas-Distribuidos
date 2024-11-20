export function stringParaEntradaDeData(data) {
    if (data) {
        return new Date(data).toISOString().split('T')[0];
    }
    return new Date().toISOString().split('T')[0];
}