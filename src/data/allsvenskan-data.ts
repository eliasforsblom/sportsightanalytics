
// Sample data for Allsvenskan teams and fixtures for 2025
// In a real application, this would come from an API or database

export interface Team {
  id: string;
  name: string;
  shortName: string;
  color: string;
}

export interface Fixture {
  id: string;
  fixtureNumber: number;
  teamId: string;
  opponent: string;
  xG: number;
  goalsScored: number;
  xGA: number;
  goalsConceded: number;
  isHomeGame: boolean;
}

// Teams in Allsvenskan 2025
export const teams: Team[] = [
  { id: "aik", name: "AIK", shortName: "AIK", color: "#000000" },
  { id: "dif", name: "Djurgårdens IF", shortName: "DIF", color: "#1B4F9A" },
  { id: "mff", name: "Malmö FF", shortName: "MFF", color: "#0097CE" },
  { id: "ifk", name: "IFK Göteborg", shortName: "GÖTEBORG", color: "#0053A0" },
  { id: "ham", name: "Hammarby IF", shortName: "HAMMARBY", color: "#1B783A" },
  { id: "ifn", name: "IF Norrköping", shortName: "NORRKÖPING", color: "#0091CF" },
  { id: "bk", name: "BK Häcken", shortName: "HÄCKEN", color: "#FFEC00" },
  { id: "elfs", name: "IF Elfsborg", shortName: "ELFSBORG", color: "#FFEC00" },
  { id: "kalmar", name: "Kalmar FF", shortName: "KALMAR", color: "#ED1C24" },
  { id: "hbk", name: "Halmstads BK", shortName: "HALMSTAD", color: "#0068B3" },
  { id: "sirius", name: "IK Sirius", shortName: "SIRIUS", color: "#0D4F9A" },
  { id: "aff", name: "Åtvidabergs FF", shortName: "ÅFF", color: "#018FD0" },
  { id: "bp", name: "Brommapojkarna", shortName: "BP", color: "#DA291C" },
  { id: "orebro", name: "Örebro SK", shortName: "ÖREBRO", color: "#000000" },
  { id: "gais", name: "GAIS", shortName: "GAIS", color: "#006633" },
  { id: "mjallby", name: "Mjällby AIF", shortName: "MAIF", color: "#FFCC00" }
];

// Generate sample fixture data
// This would be replaced by real data from an API or database
export const fixtures: Fixture[] = [
  // First 5 fixtures for AIK
  { id: "f1", fixtureNumber: 1, teamId: "aik", opponent: "dif", xG: 1.2, goalsScored: 1, xGA: 0.9, goalsConceded: 0, isHomeGame: true },
  { id: "f2", fixtureNumber: 2, teamId: "aik", opponent: "mff", xG: 0.8, goalsScored: 0, xGA: 1.8, goalsConceded: 2, isHomeGame: false },
  { id: "f3", fixtureNumber: 3, teamId: "aik", opponent: "ifk", xG: 1.5, goalsScored: 2, xGA: 0.6, goalsConceded: 0, isHomeGame: true },
  { id: "f4", fixtureNumber: 4, teamId: "aik", opponent: "ham", xG: 1.0, goalsScored: 1, xGA: 1.3, goalsConceded: 2, isHomeGame: false },
  { id: "f5", fixtureNumber: 5, teamId: "aik", opponent: "ifn", xG: 1.7, goalsScored: 1, xGA: 1.2, goalsConceded: 1, isHomeGame: true },
  
  // First 5 fixtures for Djurgården
  { id: "f6", fixtureNumber: 1, teamId: "dif", opponent: "aik", xG: 0.9, goalsScored: 0, xGA: 1.2, goalsConceded: 1, isHomeGame: false },
  { id: "f7", fixtureNumber: 2, teamId: "dif", opponent: "ham", xG: 1.6, goalsScored: 2, xGA: 1.2, goalsConceded: 1, isHomeGame: true },
  { id: "f8", fixtureNumber: 3, teamId: "dif", opponent: "mff", xG: 0.7, goalsScored: 1, xGA: 1.9, goalsConceded: 1, isHomeGame: false },
  { id: "f9", fixtureNumber: 4, teamId: "dif", opponent: "ifk", xG: 2.1, goalsScored: 3, xGA: 1.2, goalsConceded: 1, isHomeGame: true },
  { id: "f10", fixtureNumber: 5, teamId: "dif", opponent: "bk", xG: 1.3, goalsScored: 0, xGA: 1.5, goalsConceded: 2, isHomeGame: false },
  
  // First 5 fixtures for Malmö FF
  { id: "f11", fixtureNumber: 1, teamId: "mff", opponent: "ifk", xG: 2.3, goalsScored: 2, xGA: 0.8, goalsConceded: 0, isHomeGame: true },
  { id: "f12", fixtureNumber: 2, teamId: "mff", opponent: "aik", xG: 1.8, goalsScored: 2, xGA: 0.8, goalsConceded: 0, isHomeGame: true },
  { id: "f13", fixtureNumber: 3, teamId: "mff", opponent: "dif", xG: 1.9, goalsScored: 1, xGA: 0.7, goalsConceded: 1, isHomeGame: true },
  { id: "f14", fixtureNumber: 4, teamId: "mff", opponent: "elfs", xG: 1.4, goalsScored: 0, xGA: 1.6, goalsConceded: 1, isHomeGame: false },
  { id: "f15", fixtureNumber: 5, teamId: "mff", opponent: "kalmar", xG: 2.5, goalsScored: 3, xGA: 0.9, goalsConceded: 1, isHomeGame: true },
  
  // First 5 fixtures for IFK Göteborg
  { id: "f16", fixtureNumber: 1, teamId: "ifk", opponent: "mff", xG: 0.8, goalsScored: 0, xGA: 2.3, goalsConceded: 2, isHomeGame: false },
  { id: "f17", fixtureNumber: 2, teamId: "ifk", opponent: "hbk", xG: 1.7, goalsScored: 2, xGA: 0.5, goalsConceded: 0, isHomeGame: true },
  { id: "f18", fixtureNumber: 3, teamId: "ifk", opponent: "aik", xG: 0.6, goalsScored: 0, xGA: 1.5, goalsConceded: 2, isHomeGame: false },
  { id: "f19", fixtureNumber: 4, teamId: "ifk", opponent: "dif", xG: 1.2, goalsScored: 1, xGA: 2.1, goalsConceded: 3, isHomeGame: false },
  { id: "f20", fixtureNumber: 5, teamId: "ifk", opponent: "bp", xG: 2.0, goalsScored: 3, xGA: 0.8, goalsConceded: 0, isHomeGame: true },
  
  // First 5 fixtures for Hammarby
  { id: "f21", fixtureNumber: 1, teamId: "ham", opponent: "bp", xG: 1.8, goalsScored: 2, xGA: 0.7, goalsConceded: 0, isHomeGame: true },
  { id: "f22", fixtureNumber: 2, teamId: "ham", opponent: "dif", xG: 1.2, goalsScored: 1, xGA: 1.6, goalsConceded: 2, isHomeGame: false },
  { id: "f23", fixtureNumber: 3, teamId: "ham", opponent: "kalmar", xG: 1.5, goalsScored: 1, xGA: 1.0, goalsConceded: 0, isHomeGame: true },
  { id: "f24", fixtureNumber: 4, teamId: "ham", opponent: "aik", xG: 1.3, goalsScored: 2, xGA: 1.0, goalsConceded: 1, isHomeGame: true },
  { id: "f25", fixtureNumber: 5, teamId: "ham", opponent: "sirius", xG: 1.9, goalsScored: 1, xGA: 1.1, goalsConceded: 2, isHomeGame: false },
  
  // Add more fixtures for other teams as needed
  // ...
  
  // Additional fixtures for all teams would continue in a real application
];

