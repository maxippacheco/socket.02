const BandList = require('./band-list');

class Sockets {

    constructor( io ) {

        this.io = io;

        this.bandList = new BandList();

        this.socketEvents();
    }

    socketEvents() {
        // On connection
        this.io.on('connection', ( socket ) => {
            console.log('Connected');            
            
            // Emit actual bands => to the client
            socket.emit('current-bands', this.bandList.getBands() );

            // votar banda
            socket.on('votar-banda', ( id ) => {
                this.bandList.increaseVotes( id );
            
                // le emite a todos los clientes conectados
                this.io.emit('current-bands', this.bandList.getBands() );
            });

            socket.on( 'borrar-banda' , ( id ) => {
                this.bandList.removeBand( id );
            
                // le emite a todos los clientes conectados
                this.io.emit('current-bands', this.bandList.getBands() );
            });

            // data => { id, nombre }
            socket.on( 'cambiar-nombre-banda' , ( { id, nombre } ) => {
                this.bandList.changeBandName( id, nombre );
            
                // le emite a todos los clientes conectados
                this.io.emit('current-bands', this.bandList.getBands() );
            });

            socket.on( 'nueva-banda' , ( { nombre } ) => {
                this.bandList.addBand( nombre );
            
                // le emite a todos los clientes conectados
                this.io.emit('current-bands', this.bandList.getBands() );
            });

        });
    }


}


module.exports = Sockets;