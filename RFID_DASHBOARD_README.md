# RFID Card Scanner Dashboard

A dynamic web dashboard for capturing and managing RFID card scans from a Desktop Reader Writer that functions as a keyboard input device. **Now with Vehicle Profile Management!**

## Features

- **Real-time Card Scanning**: Automatically captures RFID card data when scanned
- **Vehicle Profile System**: Link RFID cards to complete vehicle profiles
- **Instant Vehicle Display**: When a card is scanned, the associated vehicle profile automatically pops up
- **Vehicle Management**: Add, edit, and delete vehicle profiles with detailed information
- **Record Management**: Maintains a complete history of all scanned cards
- **Statistics**: Shows total scans and unique card count
- **Search & Filter**: Search through scan history by card ID, time, or date
- **Data Export**: Export all scan records to CSV format (includes vehicle information)
- **Persistent Storage**: All data is saved locally using browser localStorage
- **Modern UI**: Clean, dark-themed interface optimized for scanning workflows

## How to Use

1. **Open the Dashboard**:
   - Simply open `rfid-dashboard.html` in your web browser
   - No server required - works completely offline

2. **Add Vehicle Profiles** (Recommended First Step):
   - Click "Manage Vehicle Profiles" button in the scan panel
   - Click "+ Add New Vehicle" to create a vehicle profile
   - Enter the RFID Card ID (or scan it first, then add profile)
   - Fill in vehicle details:
     - Vehicle Name/Identifier (required)
     - License Plate Number (required)
     - Vehicle Type (Sedan, SUV, Truck, etc.)
     - Make & Model
     - Color
     - Owner Name
     - Owner Phone
     - Additional Notes
   - Click "Save Vehicle" to store the profile

3. **Scan Cards**:
   - The input field at the top-left is automatically focused
   - Place your cursor focus on the input field (or anywhere on the page)
   - Scan an RFID card with your Desktop Reader Writer
   - The card ID will be automatically captured and added to the records
   - **If a vehicle profile exists for that card, it will automatically display in the Vehicle Profile panel!**

4. **View Vehicle Profiles**:
   - When you scan a card with an associated vehicle profile, the profile automatically appears
   - The profile shows all vehicle information in an organized layout
   - Click "Edit" on the profile to modify vehicle details
   - Click on any scan record in the history table to view that vehicle's profile

5. **View Records**:
   - All scanned cards appear in the table on the right
   - Each scan shows: Card ID, Vehicle Name (if linked), Timestamp, Date, and Scan Count
   - Most recent scans appear at the top
   - Click any row to view that vehicle's profile

6. **Manage Vehicles**:
   - Click "Manage Vehicle Profiles" to see all registered vehicles
   - Edit or delete vehicle profiles as needed
   - Vehicle profiles are linked by RFID Card ID

7. **Search Records**:
   - Use the search box to filter records by card ID, time, or date
   - Search updates in real-time as you type

8. **Export Data**:
   - Click "Export CSV" to download all scan records
   - File includes vehicle information (name and plate) if available
   - File will be named `rfid-scans-YYYY-MM-DD.csv`

9. **Clear Records**:
   - Click "Clear All" to remove all scan records
   - Note: This does NOT delete vehicle profiles
   - Confirmation dialog prevents accidental deletion

## Technical Details

- **Storage**: Uses browser localStorage (persists across browser sessions)
  - Scan records stored under `rfid_scans` key
  - Vehicle profiles stored under `rfid_vehicles` key
- **Input Detection**: Listens for Enter key press (standard RFID reader behavior)
- **Auto-focus**: Input field automatically regains focus after interactions
- **Vehicle Linking**: RFID Card IDs are used as keys to link scans to vehicle profiles
- **No Dependencies**: Pure HTML/CSS/JavaScript - no external libraries required

## Vehicle Profile Fields

Each vehicle profile can contain:
- **RFID Card ID** (required, unique identifier)
- **Vehicle Name/Identifier** (required)
- **License Plate Number** (required)
- **Vehicle Type** (Sedan, SUV, Truck, Van, Motorcycle, Bus, Other)
- **Make & Model** (e.g., "Toyota Camry 2020")
- **Color**
- **Owner Name**
- **Owner Phone**
- **Additional Notes** (free text field)

## Workflow Example

1. **Setup Phase**:
   - Scan an RFID card: `ABC123456`
   - Click "Manage Vehicle Profiles" → "Add New Vehicle"
   - Card ID is pre-filled from the scan
   - Enter vehicle details and save

2. **Daily Use**:
   - Scan the same card: `ABC123456`
   - Vehicle profile automatically appears showing all details
   - Scan is recorded in history
   - Quick access to vehicle information without manual lookup

## Browser Compatibility

Works in all modern browsers:
- Chrome/Edge (recommended)
- Firefox
- Safari
- Opera

## Notes

- The dashboard assumes your RFID reader sends an Enter key after the card ID
- If your reader behaves differently, you may need to adjust the input detection logic
- Data is stored locally in your browser - clearing browser data will remove scan records
- For multi-user or server-side persistence, consider integrating with the backend server (`server.js`)

