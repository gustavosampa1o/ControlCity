
//login sucesso

const { autenticar } = require('../auth');

test('login válido', () => {
    const result = autenticar(
        'admin@controlcity.com',
        'demo123',
        'admin'
    );

    expect(result.sucesso).toBe(true);
});

//login falha
test('login inválido', () => {
    const result = autenticar(
        'admin@controlcity.COM',
        'demo1234',
        'admin'
    );

    expect(result.sucesso).toBe(false);
});
