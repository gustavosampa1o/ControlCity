/**
 * @jest-environment node
 */

const { buildLoginResponse } = require('../server.cjs');

test('login válido', () => {
    const rows = [{ role: 'admin' }];
    const result = buildLoginResponse(rows, 'admin@controlcity.com');

    expect(result.sucesso).toBe(true);
    expect(result.user.email).toBe('admin@controlcity.com');
    expect(result.user.userType).toBe('admin');
});

test('login inválido', () => {
    const result = buildLoginResponse([], 'wrong@email.com');

    expect(result.sucesso).toBe(false);
});
