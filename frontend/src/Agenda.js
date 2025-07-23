import { useState, useEffect } from 'react';
import axios from 'axios';

const Agenda = () => {
    const [contactos, setContactos] = useState([]);
    const [nombre, setNombre] = useState('');
    const [telefono, setTelefono] = useState('');

    useEffect(() => {
        cargarContactos();
    }, []);

    const cargarContactos = async () => {
        const res = await axios.get('http://localhost:5000/contactos');
        setContactos(res.data);
    };

    const agregarContacto = async () => {
        const res = await axios.post('http://localhost:5000/contactos', { nombre, telefono });
        setContactos([...contactos, res.data]);
    };

    const eliminarContacto = async (id) => {
        await axios.delete(`http://localhost:5000/contactos/${id}`);
        setContactos(contactos.filter(c => c.id !== id));
    };

    return (
        <div>
            <h1>Agenda de Contactos</h1>
            <input type="text" placeholder="Nombre" onChange={(e) => setNombre(e.target.value)} />
            <input type="text" placeholder="Teléfono" onChange={(e) => setTelefono(e.target.value)} />
            <button onClick={agregarContacto}>Agregar</button>

            <ul>
                {contactos.map(c => (
                    <li key={c.id}>
                        {c.nombre} - {c.telefono}
                        <button onClick={() => eliminarContacto(c.id)}>Eliminar</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Agenda;