#!/bin/bash

# Paths to the input images
qr_image=$1
coupon_image="./coupons/coupon_base.svg"

# Output image path
output_path="./coupons/printed/"
output_image="$output_path/coupon_$(basename "$1" | sed 's/qr_point_//')"

# Dimensions and coordinates
qr_width=195
qr_height=$qr_width
qr_position_x=33
qr_position_y=260

coupon_width=250
coupon_height=480

# Check if the downsampled coupon image already exists
if [[ ! -f "./coupons/coupon_base.png" ]]; then
    # Rasterize the SVG coupon image
    convert -density 300 -resize "${coupon_width}x${coupon_height}" "$coupon_image" "./coupons/coupon_base.png"
fi

coupon_base="./coupons/coupon_base.png"

# Calculate the dimensions of the output image
output_width=$coupon_width
output_height=$coupon_height

# Composite the QR code onto the coupon image
#convert "$temp_coupon_image" -extent "${output_width}x${output_height}" "$output_image"
convert "$coupon_base" "$qr_image" -geometry "+${qr_position_x}+${qr_position_y}" -composite "$output_image"
