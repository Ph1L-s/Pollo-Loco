import os
import re

# Mapping of old paths to new paths based on actual file structure
image_mappings = {
    # Character Pepe - Idle animations
    'assets/images/sprites/2_character_pepe/1_idle/idle/i1.png': 'assets/images/sprites/2_character_pepe/1_idle/idle/i_1.png',
    'assets/images/sprites/2_character_pepe/1_idle/idle/i2.png': 'assets/images/sprites/2_character_pepe/1_idle/idle/i_2.png',
    'assets/images/sprites/2_character_pepe/1_idle/idle/i3.png': 'assets/images/sprites/2_character_pepe/1_idle/idle/i_3.png',
    'assets/images/sprites/2_character_pepe/1_idle/idle/i4.png': 'assets/images/sprites/2_character_pepe/1_idle/idle/i_4.png',
    'assets/images/sprites/2_character_pepe/1_idle/idle/i5.png': 'assets/images/sprites/2_character_pepe/1_idle/idle/i_5.png',
    'assets/images/sprites/2_character_pepe/1_idle/idle/i6.png': 'assets/images/sprites/2_character_pepe/1_idle/idle/i_6.png',
    'assets/images/sprites/2_character_pepe/1_idle/idle/i7.png': 'assets/images/sprites/2_character_pepe/1_idle/idle/i_7.png',
    'assets/images/sprites/2_character_pepe/1_idle/idle/i8.png': 'assets/images/sprites/2_character_pepe/1_idle/idle/i_8.png',
    'assets/images/sprites/2_character_pepe/1_idle/idle/i9.png': 'assets/images/sprites/2_character_pepe/1_idle/idle/i_9.png',
    'assets/images/sprites/2_character_pepe/1_idle/idle/i10.png': 'assets/images/sprites/2_character_pepe/1_idle/idle/i_10.png',
    
    # Long idle
    'assets/images/sprites/2_character_pepe/1_idle/long_idle/i11.png': 'assets/images/sprites/2_character_pepe/1_idle/long_idle/i_11.png',
    'assets/images/sprites/2_character_pepe/1_idle/long_idle/i12.png': 'assets/images/sprites/2_character_pepe/1_idle/long_idle/i_12.png',
    'assets/images/sprites/2_character_pepe/1_idle/long_idle/i13.png': 'assets/images/sprites/2_character_pepe/1_idle/long_idle/i_13.png',
    'assets/images/sprites/2_character_pepe/1_idle/long_idle/i14.png': 'assets/images/sprites/2_character_pepe/1_idle/long_idle/i_14.png',
    'assets/images/sprites/2_character_pepe/1_idle/long_idle/i15.png': 'assets/images/sprites/2_character_pepe/1_idle/long_idle/i_15.png',
    'assets/images/sprites/2_character_pepe/1_idle/long_idle/i16.png': 'assets/images/sprites/2_character_pepe/1_idle/long_idle/i_16.png',
    'assets/images/sprites/2_character_pepe/1_idle/long_idle/i17.png': 'assets/images/sprites/2_character_pepe/1_idle/long_idle/i_17.png',
    'assets/images/sprites/2_character_pepe/1_idle/long_idle/i18.png': 'assets/images/sprites/2_character_pepe/1_idle/long_idle/i_18.png',
    'assets/images/sprites/2_character_pepe/1_idle/long_idle/i19.png': 'assets/images/sprites/2_character_pepe/1_idle/long_idle/i_19.png',
    'assets/images/sprites/2_character_pepe/1_idle/long_idle/i20.png': 'assets/images/sprites/2_character_pepe/1_idle/long_idle/i_20.png',
    
    # Walk animations
    'assets/images/sprites/2_character_pepe/2_walk/w1.png': 'assets/images/sprites/2_character_pepe/2_walk/w_21.png',
    'assets/images/sprites/2_character_pepe/2_walk/w2.png': 'assets/images/sprites/2_character_pepe/2_walk/w_22.png',
    'assets/images/sprites/2_character_pepe/2_walk/w3.png': 'assets/images/sprites/2_character_pepe/2_walk/w_23.png',
    'assets/images/sprites/2_character_pepe/2_walk/w4.png': 'assets/images/sprites/2_character_pepe/2_walk/w_24.png',
    'assets/images/sprites/2_character_pepe/2_walk/w5.png': 'assets/images/sprites/2_character_pepe/2_walk/w_25.png',
    'assets/images/sprites/2_character_pepe/2_walk/w6.png': 'assets/images/sprites/2_character_pepe/2_walk/w_26.png',
    
    # Jump animations
    'assets/images/sprites/2_character_pepe/3_jump/j1.png': 'assets/images/sprites/2_character_pepe/3_jump/j_31.png',
    'assets/images/sprites/2_character_pepe/3_jump/j2.png': 'assets/images/sprites/2_character_pepe/3_jump/j_32.png',
    'assets/images/sprites/2_character_pepe/3_jump/j3.png': 'assets/images/sprites/2_character_pepe/3_jump/j_33.png',
    'assets/images/sprites/2_character_pepe/3_jump/j4.png': 'assets/images/sprites/2_character_pepe/3_jump/j_34.png',
    'assets/images/sprites/2_character_pepe/3_jump/j5.png': 'assets/images/sprites/2_character_pepe/3_jump/j_35.png',
    'assets/images/sprites/2_character_pepe/3_jump/j6.png': 'assets/images/sprites/2_character_pepe/3_jump/j_36.png',
    'assets/images/sprites/2_character_pepe/3_jump/j7.png': 'assets/images/sprites/2_character_pepe/3_jump/j_37.png',
    'assets/images/sprites/2_character_pepe/3_jump/j8.png': 'assets/images/sprites/2_character_pepe/3_jump/j_38.png',
    'assets/images/sprites/2_character_pepe/3_jump/j9.png': 'assets/images/sprites/2_character_pepe/3_jump/j_39.png',
    
    # Hurt animations
    'assets/images/sprites/2_character_pepe/4_hurt/h1.png': 'assets/images/sprites/2_character_pepe/4_hurt/h_41.png',
    'assets/images/sprites/2_character_pepe/4_hurt/h2.png': 'assets/images/sprites/2_character_pepe/4_hurt/h_42.png',
    'assets/images/sprites/2_character_pepe/4_hurt/h3.png': 'assets/images/sprites/2_character_pepe/4_hurt/h_43.png',
    
    # Dead animations
    'assets/images/sprites/2_character_pepe/5_dead/d1.png': 'assets/images/sprites/2_character_pepe/5_dead/d_51.png',
    'assets/images/sprites/2_character_pepe/5_dead/d2.png': 'assets/images/sprites/2_character_pepe/5_dead/d_52.png',
    'assets/images/sprites/2_character_pepe/5_dead/d3.png': 'assets/images/sprites/2_character_pepe/5_dead/d_53.png',
    'assets/images/sprites/2_character_pepe/5_dead/d4.png': 'assets/images/sprites/2_character_pepe/5_dead/d_54.png',
    'assets/images/sprites/2_character_pepe/5_dead/d5.png': 'assets/images/sprites/2_character_pepe/5_dead/d_55.png',
    'assets/images/sprites/2_character_pepe/5_dead/d6.png': 'assets/images/sprites/2_character_pepe/5_dead/d_56.png',
    'assets/images/sprites/2_character_pepe/5_dead/d7.png': 'assets/images/sprites/2_character_pepe/5_dead/d_57.png',
}

def update_file_references(file_path):
    """Update image references in a file"""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original_content = content
    changes_made = False
    
    for old_path, new_path in image_mappings.items():
        if old_path in content:
            content = content.replace(old_path, new_path)
            changes_made = True
            print(f"  Updated: {old_path} -> {new_path}")
    
    if changes_made:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
    return False

def process_js_files():
    """Process all JavaScript files"""
    js_folder = r"C:\Users\phill\Documents\GitHub\LogoPollo\main\Pollo-Loco\js"
    total_updated = 0
    
    for root, dirs, files in os.walk(js_folder):
        for file in files:
            if file.endswith('.js'):
                file_path = os.path.join(root, file)
                print(f"Processing: {file_path}")
                if update_file_references(file_path):
                    total_updated += 1
    
    return total_updated

if __name__ == "__main__":
    print("Updating image references in JavaScript files...")
    updated_count = process_js_files()
    print(f"\nTotal files updated: {updated_count}")