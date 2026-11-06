/**
 * Configuración centralizada de endpoints del Backend Spring Boot (Puerto 8080)
 */
export const API_CONFIG = {
  baseUrl: 'http://localhost:8080/api',
  endpoints: {
    authLogin: 'http://localhost:8080/api/auth/login',
    mesas: 'http://localhost:8080/api/mesas',
    categorias: 'http://localhost:8080/api/categorias',
    productos: 'http://localhost:8080/api/productos',
    pedidos: 'http://localhost:8080/api/pedidos',
    usuarios: 'http://localhost:8080/api/usuarios'
  }
};
