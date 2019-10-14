import React from 'react'

const Operacao = ({ operacao }) => {
    return (
        <p>
            {operacao.descricao} - R$ {operacao.valor}
        </p>
    )
}

export default Operacao