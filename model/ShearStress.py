import math

dblManning = 0.0
dblRadiusofCurvature = 0.0
dblWidth = 0.0
intCorrections = 0

cintMaxNumberofPoints = 23
cdblPi = 3.14159265358979

def HydraulicRadii():
    adblArea = [0.0] * cintMaxNumberofPoints
    adblWettedPerimeter = [0.0] * cintMaxNumberofPoints
    adblBankGeomX = [0.0] * cintMaxNumberofPoints
    adblBankGeomZ = [0.0] * cintMaxNumberofPoints
    adblSegmentsX = [0.0] * cintMaxNumberofPoints
    adblSegmentsZ = [0.0] * cintMaxNumberofPoints
    adblShearStress = [0.0] * cintMaxNumberofPoints
    adblX = [0.0] * cintMaxNumberofPoints
    adblZ = [0.0] * cintMaxNumberofPoints
    blnBankfull = False
    blnMoreChannel = False
    dblAverageShearStress = 0.0
    dblBankIntersectStation = 0.0
    dblElevation1 = 0.0
    dblElevation2 = 0.0
    dblElevationV = 0.0
    dblElevationBottomLeft = 0.0
    dblElevationBottomRight = 0.0
    dblElevationTopLeft = 0.0
    dblElevationTopRight = 0.0
    dblSlope = 0.0
    dblStation1 = 0.0
    dblStation2 = 0.0
    dblStationBottomLeft = 0.0
    dblStationBottomRight = 0.0
    dblStationTopLeft = 0.0
    dblStationTopRight = 0.0
    dblSumAbsoluteElevation = 0.0
    dblTotalAbsoluteElevation = 0.0
    dblWaterIntersectStation = 0.0
    dblWSElevation = 0.0
    intPoint = 0
    intResponse = 0
    intToePoint = 0
    intNumberofPoints = 0
    intVertex = 0
    strErrMsg = ""
    strErrMsg1 = ""

    strErrMsg = "The model is unable to determine the applied shear stress. Please ensure " \
                "that you have entered a reasonable flow depth and a channel slope on the" \
                "'Input Geometry' sheet."
    strErrMsg1 = "NOTE: You have not assigned bank layer information to the entire bank" \
                + "\nprofile. Please ensure that the sum of the bank layer thicknesses on the " \
                + "\n'Input Geometry' sheet are equal to or greater than the bank height."

    if (Worksheets("Input Geometry").Cells(136, 5).Value > Worksheets("Input Geometry").Cells(55, 3).Value \
        or Worksheets("Input Geometry").Cells(53, 3).Value == ""):
        intResponse = MsgBox(strErrMsg, vbOKOnly)
        Worksheets("Input Geometry").Activate
        return

    dblWSElevation = Worksheets("Toe Model").Cells(3, 7).Value
    dblSlope = Worksheets("Input Geometry").Cells(53, 3).Value

    ReadBankGeometry(adblBankGeomX, adblBankGeomZ, intToePoint)

    if (Worksheets("Toe Model").Cells(9, 2).Value > round(adblBankGeomZ[cintMaxNumberofPoints], 2)):
        MsgBox(strErrMsg1)
        Worksheets("Bank Material").Activate
        return

    intPoint = 0
    while (cintMaxNumberofPoints > intPoint + 1):
        intPoint = intPoint + 1
        dblElevation1 = adblBankGeomZ[intPoint]
        dblElevation2 = adblBankGeomZ[intPoint + 1]
        if (dblElevation2 < dblWSElevation):
            break

    if ((2 >= intPoint) and (dblWSElevation >= dblElevation1)):
        dblBankIntersectStation = adblBankGeomX[2]
        blnBankfull = True
    else:
        dblStation1 = adblBankGeomX[intPoint]
        dblStation2 = adblBankGeomX[intPoint + 1]
        dblBankIntersectStation = dblStation1 + (dblStation2 - dblStation1) \
                        * (dblWSElevation - dblElevation1) / (dblElevation2 - dblElevation1)

    dblElevationV = adblBankGeomZ[cintMaxNumberofPoints - 1]
    if (adblBankGeomX[2] > adblBankGeomX[cintMaxNumberofPoints - 1]):
        dblWaterIntersectStation = adblBankGeomX[cintMaxNumberofPoints - 1] + (dblWSElevation - dblElevationV) * math.tan \
                        ((cdblPi / 2 + math.atan(abs(dblElevationV - adblBankGeomZ[cintMaxNumberofPoints]) \
                        / (adblBankGeomX[cintMaxNumberofPoints] - adblBankGeomX[cintMaxNumberofPoints - 1])))) / 2
    else:
        dblWaterIntersectStation = adblBankGeomX[cintMaxNumberofPoints - 1] + (dblWSElevation - dblElevationV) * \
                            math.tan((cdblPi / 2 + math.atan(abs(dblElevationV - adblBankGeomZ[cintMaxNumberofPoints])) \
                            / (adblBankGeomX[cintMaxNumberofPoints] - adblBankGeomX[cintMaxNumberofPoints - 1])) \
                            - math.atan((adblBankGeomX[cintMaxNumberofPoints - 1] - adblBankGeomX[2]) \
                            / (adblBankGeomZ[2] - dblElevationV))) / 2

    for intNumberofPoints in range(2, cintMaxNumberofPoints - 1):
        if (adblBankGeomZ[intNumberofPoints] <= dblWSElevation):
            break

    adblSegmentsX[intNumberofPoints - 1] = dblBankIntersectStation
    if blnBankfull:
        adblSegmentsZ[intNumberofPoints - 1] = adblBankGeomZ[intNumberofPoints]
    else:
        adblSegmentsZ[intNumberofPoints - 1] = dblWSElevation

    for intPoint in range(intNumberofPoints, cintMaxNumberofPoints - 1):
        adblSegmentsX[intPoint] = 0.5 * (adblBankGeomX[intPoint] + adblBankGeomX[intPoint + 1])
        adblSegmentsZ[intPoint] = 0.5 * (adblBankGeomZ[intPoint] + adblBankGeomZ[intPoint + 1])
        dblTotalAbsoluteElevation = dblTotalAbsoluteElevation + abs(adblSegmentsZ[intPoint - 1] - adblSegmentsZ[intPoint])

    adblSegmentsX[cintMaxNumberofPoints] = dblWaterIntersectStation
    if (adblBankGeomX[cintMaxNumberofPoints] > dblWaterIntersectStation):
        blnMoreChannel = True
        adblSegmentsX[cintMaxNumberofPoints] = adblBankGeomX[cintMaxNumberofPoints]
    adblSegmentsZ[cintMaxNumberofPoints] = adblBankGeomZ[cintMaxNumberofPoints]

    dblElevationBottomLeft = adblSegmentsZ[intNumberofPoints - 1]
    dblElevationBottomRight = dblWSElevation
    dblStationBottomRight = adblSegmentsX[intNumberofPoints - 1]
    dblStationBottomLeft = dblStationBottomRight

    dblAverageShearStress = 0.0
    dblSumAbsoluteElevation = 0.0

    for intPoint in range(intNumberofPoints, cintMaxNumberofPoints):
        dblStationTopLeft = dblStationBottomLeft
        dblElevationTopLeft = dblElevationBottomLeft
        dblStationTopRight = dblStationBottomRight
        dblElevationTopRight = dblElevationBottomRight

        intVertex = 0
        adblX[intVertex + 1] = dblStationTopLeft
        adblZ[intVertex + 1] = dblElevationTopLeft
        intVertex = intVertex + 1

        if ((intPoint > intNumberofPoints) or blnBankfull):
            adblX[intVertex + 1] = dblStationTopRight
            adblZ[intVertex + 1] = dblElevationTopRight
            intVertex = intVertex + 1

        if (cintMaxNumberofPoints > intPoint):
            dblSumAbsoluteElevation = dblSumAbsoluteElevation + abs(adblSegmentsZ[intPoint - 1] - \
                                                                    adblSegmentsZ[intPoint])
            dblStationBottomRight = dblBankIntersectStation + \
                                    (dblWaterIntersectStation - dblBankIntersectStation) \
                                     * dblSumAbsoluteElevation / dblTotalAbsoluteElevation
            adblX[intVertex + 1] = dblStationBottomRight
            adblZ[intVertex + 1] = dblElevationBottomRight
            intVertex = intVertex + 1

            dblStationBottomLeft = adblSegmentsX[intPoint]
            dblElevationBottomLeft = adblSegmentsZ[intPoint]
            adblX[intVertex + 1] = dblStationBottomLeft
            adblZ[intVertex + 1] = dblElevationBottomLeft
            intVertex = intVertex + 1
        elif blnMoreChannel:
            adblX[intVertex + 1] = adblBankGeomX[intPoint]
            adblZ[intVertex + 1] = dblWSElevation
            intVertex = intVertex + 1

        adblX[intVertex + 1] = adblBankGeomX[intPoint]
        adblZ[intVertex + 1] = adblBankGeomZ[intPoint]
        intVertex = intVertex + 1

        adblArea[intPoint] = PolygonArea(adblX, adblZ, intVertex)
        adblWettedPerimeter[intPoint] = ((dblStationTopLeft - adblBankGeomX[intPoint]) ** 2 +
                        (dblElevationTopLeft - adblBankGeomZ[intPoint]) ** 2) ** 0.5 + \
                        ((adblBankGeomX[intPoint] - dblStationBottomLeft) ** 2 +
                        (adblBankGeomZ[intPoint] - dblElevationBottomLeft) ** 2) ** 0.5

        if adblWettedPerimeter[intPoint] == 0:
            adblWettedPerimeter[intPoint] = 0.000001

    for intPoint in range(1, intNumberofPoints - 1):
        adblArea[intPoint] = 0
        Worksheets("Toe Model").Cells((44 + intPoint), 2).Value = adblArea[intPoint]

    dblManning = 0
    intCorrections = Worksheets("Toe Model Output").Cells(84, 5).Value
    dblWidth = adblBankGeomX[cintMaxNumberofPoints] - dblBankIntersectStation
    if (dblWaterIntersectStation - dblBankIntersectStation > dblWidth):
        dblWidth = dblWaterIntersectStation - dblBankIntersectStation
    dblWidth = 2 * dblWidth

    ComputeShearStressCorrections(adblArea, adblBankGeomZ, adblShearStress, adblWettedPerimeter, \
                                dblSlope, dblWSElevation, intNumberofPoints, intCorrections)

    for intPoint in range(intNumberofPoints, cintMaxNumberofPoints):
        Worksheets("Toe Model").Cells(44 + intPoint, 2).Value = adblShearStress[intPoint]
        dblAverageShearStress = dblAverageShearStress + adblShearStress[intPoint]

    Worksheets("Toe Model Output").Cells(24, 15).Value = round(dblAverageShearStress / \
                                                        (1 + cintMaxNumberofPoints - intNumberofPoints), 2)

def Log10(X):
    return math.log(X) / math.log(10)

def PolygonArea(dblPolygonX, dblPolygonY, intNumberofVertices):
    PolygonArea = 0
    for intVertex in range(1, intNumberofVertices):
        intNextVertex = intVertex + 1
        if (intNextVertex > intNumberofVertices):
            intNextVertex = intNextVertex - intNumberofVertices
        PolygonArea = PolygonArea + dblPolygonX[intVertex] * dblPolygonY[intNextVertex] \
                                   - dblPolygonY[intVertex] * dblPolygonX[intNextVertex]

    PolygonArea = 0.5 * PolygonArea
    if (PolygonArea < 0):
        PolygonArea = -PolygonArea
    return PolygonArea

def ComputeShearStressCorrections(adblArea, adblBankGeomZ, adblShearStress, adblWettedPerimeter, \
                                dblSlope, dblWSElevation, intNumberofPoints, intCorrections):
    cdblA = 4.16892048974639E-02

    dblDepth = 0.0
    dblDiameter = 0.0
    dblGrainRoughness = 0.0
    dblShields = 0.0
    dblSuperElev = 0.0
    dblTemp = 0.0
    dblPerturb = 0.0
    dblVelocity = 0.0
    intLayer = 0
    intMaterial = 0
    intPoint = 0
    intResponse = 0
    strError = ""
    strError1 = ""
    strError2 = ""
    strError3 = ""

    strError = "Sorry, but in order to compute your requested corrections," + \
                "\nyou need to enter more data. Please try again!"
    strError1 = "The value you have entered for Manning's roughness coefficient," + \
                "\nn, is outside the range that has been observed in the field." + \
                "\n                     Do you want to continue?"
    strError2 = "The value you have entered for the radius of curvature," + \
                "\nis outside the range that has been observed in the field." + \
                "\n                     Do you want to continue?"
    strError3 = "Sorry, but the entered flow depth is greater than bankfull. This" + \
                "\nviolates the theory upon which adjustments for curvature are based."

    if (((intCorrections % 2) == 1) and (dblWSElevation > adblBankGeomZ[2])):
        MsgBox(strError3)
        return
    elif (intCorrections > 0):
        ToeModelForm_Initialize()
        ToeModelForm.Show()

        if (dblManning == 0):
            MsgBox(strError)
            return
        elif ((0.0156 > dblManning) or (dblManning > 0.2)):
            intResponse = MsgBox(strError1, vbYesNo)
            if (intResponse == vbNo):
                return
    else:
        dblManning = 0.035

    dblTemp = adblArea[cintMaxNumberofPoints] / adblWettedPerimeter[cintMaxNumberofPoints]
    dblVelocity = (dblTemp ** (2 / 3)) * math.sqrt(dblSlope) / dblManning

    if ((intCorrections % 2) == 1):
        if (dblRadiusofCurvature * dblWidth == 0):
            MsgBox(strError)
            return
        elif (0.5 * dblWidth > dblRadiusofCurvature):
            intResponse = MsgBox(strError2, vbYesNo)
            if (intResponse == vbNo):
                return

        dblDepth = -99999999
        for intPoint in range(intNumberofPoints, cintMaxNumberofPoints):
            if (dblWSElevation - adblBankGeomZ[intPoint] > dblDepth):
                dblDepth = dblWSElevation - adblBankGeomZ[intPoint]

        intMaterial = Worksheets("Toe Model Output").Cells(74, 5).Value

        if (intMaterial >= 1 and intMaterial <= 7):
            dblTemp = Worksheets("Toe Model Output").Cells(74, 11).Value
            if (dblTemp > 1.944):
                dblDiameter = 0.001 * dblTemp / (0.06 * 16200)
            else:
                dblDiameter = 0.001 * dblTemp / (0.044 * 16200)
        elif (intMaterial >= 8 and intMaterial <= 10 or intMaterial == 17):
            dblDiameter = 1.10485434560398E-05
        elif (intMaterial >= 11 and intMaterial <= 16):
            dblDiameter = 0.000001953125

        dblShields = ((dblManning * dblVelocity) ** 2) / (1.65 * dblDiameter * (dblTemp ** (1 / 3)))
        dblSuperElev = 0.9 * dblDepth * math.sqrt(dblShields) * dblWidth * (1 - dblManning * math.sqrt(9.807) / (0.408 * (dblTemp ** (1 / 6)))) \
                        / dblRadiusofCurvature

        dblPerturb = 0.5 * (dblSuperElev / dblDepth + 0.5 * dblWidth / dblRadiusofCurvature)
        dblVelocity = dblVelocity * (1 + dblPerturb)

    for intPoint in range(intNumberofPoints, cintMaxNumberofPoints):
        adblShearStress[intPoint] = 9807 * (dblManning ** 2) * (dblTemp ** (-1 / 3)) * (dblVelocity ** 2) \
                                    * adblArea[intPoint] * adblWettedPerimeter[cintMaxNumberofPoints] \
                                    / (adblArea[cintMaxNumberofPoints] * adblWettedPerimeter[intPoint])

    if (intCorrections > 1):
        for intPoint in range(intNumberofPoints, cintMaxNumberofPoints):
            intLayer = Worksheets("Toe Model").Cells(100 + intPoint, 2).Value
            intMaterial = Worksheets("Toe Model Output").Cells(68 + intLayer, 5).Value

            if (intMaterial >= 1 and intMaterial <= 7):
                dblTemp = Worksheets("Toe Model Output").Cells(68 + intLayer, 11).Value
                if (dblTemp > 1.944):
                    dblDiameter = dblTemp / (0.06 * 16200)
                else:
                    dblDiameter = dblTemp / (0.044 * 16200)
            elif (intMaterial >= 8 and intMaterial <= 10 or intMaterial == 17):
                dblDiameter = 1.10485434560398E-05
            elif (intMaterial >= 11 and intMaterial <= 16):
                dblDiameter = 0.000001953125

            dblGrainRoughness = cdblA * (dblDiameter ** (1 / 6))
            if (0.0156 > dblGrainRoughness):
                dblGrainRoughness = 0.0156

            adblShearStress[intPoint] = adblShearStress[intPoint] * (dblGrainRoughness / dblManning) ** 2

def ToeModelForm_Initialize():
    if (intCorrections == 2):
        ToeModelForm.WidthBox.Visible = False
        ToeModelForm.RadiusBox.Visible = False
        ToeModelForm.Label2.Visible = False
        ToeModelForm.Label3.Visible = False
        ToeModelForm.Label4.Visible = False
        ToeModelForm.Label5.Visible = False

    Load ToeModelForm

def ToeModelHelpForm_Initialize():
    ToeModelHelpForm.MultiPage1.Value = 0
    Load ToeModelHelpForm

def UserForm_QueryClose(Cancel, CloseMode):
    if CloseMode == vbFormControlMenu:
        Cancel = True
        FinishedButton_Click

