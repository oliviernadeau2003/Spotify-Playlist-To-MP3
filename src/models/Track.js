
export default class Track {

    name;
    artists;

    constructor(name, artists) {
        this.name = name;
        this.artists = artists;
    }

    getSearchName() { return this.name + " - " + this.getArtists() }

    getArtists() { return this.artists.map(artist => { return artist }); }

}