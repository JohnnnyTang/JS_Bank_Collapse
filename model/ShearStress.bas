Attribute VB_Name = "ShearStress"
Option Explicit
Option Base 1

Public dblManning As Double
Public dblRadiusofCurvature As Double
Public dblWidth As Double
Public intCorrections As Integer

Const cintMaxNumberofPoints = 23
Const cdblPi As Double = 3.14159265358979
Sub HydraulicRadii()
Attribute HydraulicRadii.VB_Description = "Macro developed 8/9/2000 by Eddy Langendoen"
Attribute HydraulicRadii.VB_ProcData.VB_Invoke_Func = " \n14"
'
' HydraulicRadii Macro
'
' This macro calculates the local shear stress active on the bank surface directly above
' any given point
'
' Author: Robert E. Thomas
'         USDA-ARS-NSL
'         PO Box 1157
'         Oxford, MS 38655
'
' This macro was modified last on 03/29/2008.
'
'-----------------Declarations--------------------------------
'
Dim adblArea(1 To cintMaxNumberofPoints) As Double
Dim adblWettedPerimeter(1 To cintMaxNumberofPoints) As Double
Dim adblBankGeomX(1 To cintMaxNumberofPoints) As Double
Dim adblBankGeomZ(1 To cintMaxNumberofPoints) As Double
Dim adblSegmentsX(1 To cintMaxNumberofPoints) As Double
Dim adblSegmentsZ(1 To cintMaxNumberofPoints) As Double
Dim adblShearStress(1 To cintMaxNumberofPoints) As Double
Dim adblX(1 To cintMaxNumberofPoints) As Double
Dim adblZ(1 To cintMaxNumberofPoints) As Double
Dim blnBankfull As Boolean
Dim blnMoreChannel As Boolean
Dim dblAverageShearStress As Double
Dim dblBankIntersectStation As Double
Dim dblElevation1 As Double
Dim dblElevation2 As Double
Dim dblElevationV As Double
Dim dblElevationBottomLeft As Double
Dim dblElevationBottomRight As Double
Dim dblElevationTopLeft As Double
Dim dblElevationTopRight As Double
Dim dblSlope As Double
Dim dblStation1 As Double
Dim dblStation2 As Double
Dim dblStationBottomLeft As Double
Dim dblStationBottomRight As Double
Dim dblStationTopLeft As Double
Dim dblStationTopRight As Double
Dim dblSumAbsoluteElevation As Double
Dim dblTotalAbsoluteElevation As Double
Dim dblWaterIntersectStation As Double
Dim dblWSElevation As Double
Dim intPoint As Integer
Dim intResponse As Integer
Dim intToePoint As Integer
Dim intNumberofPoints As Integer
Dim intVertex As Integer
Dim strErrMsg As String
Dim strErrMsg1 As String
'
'-------------------------------Program--------------------------------
'
'
' Error messages
'
  strErrMsg = "The model is unable to determine the applied shear stress. Please ensure " _
              & "that you have entered a reasonable flow depth and a channel slope on the" _
              & "'Input Geometry' sheet."
  strErrMsg1 = "NOTE: You have not assigned bank layer information to the entire bank" _
              & vbCr & "profile. Please ensure that the sum of the bank layer thicknesses on the " _
              & vbCr & "'Input Geometry' sheet are equal to or greater than the bank height."
'
' Check a water depth and slope have been entered and give error if not
'
  If (Worksheets("Input Geometry").Cells(136, 5).Value > Worksheets("Input Geometry").Cells(55, 3).Value _
    Or Worksheets("Input Geometry").Cells(53, 3).Value = "") Then
    intResponse = MsgBox(strErrMsg, vbOKOnly)
    Worksheets("Input Geometry").Activate
    End
  End If
'
' Read Water Elevation and Slope
'
  dblWSElevation = Worksheets("Toe Model").Cells(3, 7).Value
  dblSlope = Worksheets("Input Geometry").Cells(53, 3).Value
'
' Read inputted bank geometry
'
  Call ReadBankGeometry(adblBankGeomX(), adblBankGeomZ(), intToePoint)
'
' Check that layer information has been applied to the entire bank profile
'
  If (Worksheets("Toe Model").Cells(9, 2).Value > Application.WorksheetFunction.Round(adblBankGeomZ(cintMaxNumberofPoints), 2)) Then
    MsgBox strErrMsg1
    Worksheets("Bank Material").Activate
    End
  End If
'
' Determine intersect of water surface profile and streambank
'
' Go to top of the bank and search for points in bank profile surrounding the
' water surface elevation
'
  intPoint = 0
  Do While (cintMaxNumberofPoints > intPoint + 1)
    intPoint = intPoint + 1
    dblElevation1 = adblBankGeomZ(intPoint)
    dblElevation2 = adblBankGeomZ(intPoint + 1)
    If (dblElevation2 < dblWSElevation) Then Exit Do
  Loop
'
' Check for bankfull or over-bankfull
'
  If ((2 >= intPoint) And (dblWSElevation >= dblElevation1)) Then
    dblBankIntersectStation = adblBankGeomX(2)
    blnBankfull = True
  Else
'
' Calculate station of intersection point
'
    dblStation1 = adblBankGeomX(intPoint)
    dblStation2 = adblBankGeomX(intPoint + 1)
    dblBankIntersectStation = dblStation1 + (dblStation2 - dblStation1) _
                    * (dblWSElevation - dblElevation1) / (dblElevation2 - dblElevation1)
  End If
'
' Calculate stations of the intersections with the water surface
'
  dblElevationV = adblBankGeomZ(cintMaxNumberofPoints - 1)
  If (adblBankGeomX(2) > adblBankGeomX(cintMaxNumberofPoints - 1)) Then
    dblWaterIntersectStation = adblBankGeomX(cintMaxNumberofPoints - 1) + (dblWSElevation - dblElevationV) * Tan _
                        ((cdblPi / 2 + Atn(Abs(dblElevationV - adblBankGeomZ(cintMaxNumberofPoints)) _
                        / (adblBankGeomX(cintMaxNumberofPoints) - adblBankGeomX(cintMaxNumberofPoints - 1)))) / 2)
  Else
    dblWaterIntersectStation = adblBankGeomX(cintMaxNumberofPoints - 1) + (dblWSElevation - dblElevationV) * _
                            Tan((cdblPi / 2 + Atn(Abs(dblElevationV - adblBankGeomZ(cintMaxNumberofPoints)) _
                            / (adblBankGeomX(cintMaxNumberofPoints) - adblBankGeomX(cintMaxNumberofPoints - 1))) _
                            - Atn((adblBankGeomX(cintMaxNumberofPoints - 1) - adblBankGeomX(2)) _
                            / (adblBankGeomZ(2) - dblElevationV))) / 2)
  End If
'
' Determine how many points are below the water surface
'
  For intNumberofPoints = 2 To cintMaxNumberofPoints - 1
    If (adblBankGeomZ(intNumberofPoints) <= dblWSElevation) Then Exit For
  Next intNumberofPoints
'
' Loop over the wet nodes. First, calculate boundaries of the flow segments. Second,
' calculate absolute vertical distance along the bank.
'
  adblSegmentsX(intNumberofPoints - 1) = dblBankIntersectStation
  If blnBankfull Then
    adblSegmentsZ(intNumberofPoints - 1) = adblBankGeomZ(intNumberofPoints)
  Else
    adblSegmentsZ(intNumberofPoints - 1) = dblWSElevation
  End If
  For intPoint = intNumberofPoints To cintMaxNumberofPoints - 1
    adblSegmentsX(intPoint) = 0.5 * (adblBankGeomX(intPoint) + adblBankGeomX(intPoint + 1))
    adblSegmentsZ(intPoint) = 0.5 * (adblBankGeomZ(intPoint) + adblBankGeomZ(intPoint + 1))
    dblTotalAbsoluteElevation = dblTotalAbsoluteElevation + Abs(adblSegmentsZ(intPoint - 1) - adblSegmentsZ(intPoint))
  Next intPoint
'
' Add in-channel node- note that if node is further into the channel than the water surface
' intersector then use node's x-coordinate, otherwise use water surface intersector's x-coordinate
  adblSegmentsX(cintMaxNumberofPoints) = dblWaterIntersectStation
  If (adblBankGeomX(cintMaxNumberofPoints) > dblWaterIntersectStation) Then
    blnMoreChannel = True
    adblSegmentsX(cintMaxNumberofPoints) = adblBankGeomX(cintMaxNumberofPoints)
  End If
  adblSegmentsZ(cintMaxNumberofPoints) = adblBankGeomZ(cintMaxNumberofPoints)
'
' Initialize two vertices
'
  dblElevationBottomLeft = adblSegmentsZ(intNumberofPoints - 1)
  dblElevationBottomRight = dblWSElevation
  dblStationBottomRight = adblSegmentsX(intNumberofPoints - 1)
  dblStationBottomLeft = dblStationBottomRight
'
' Initialise cross-sectional average shear stress to zero
' Initialise the sum of the absolute elevations to zero
'
  dblAverageShearStress = 0#
  dblSumAbsoluteElevation = 0#
'
' Loop over the wet points
'
  For intPoint = intNumberofPoints To cintMaxNumberofPoints
'
' Top valley-side intersect of water and bank surfaces is the bottom valley-
' side intersect of the point above
'
    dblStationTopLeft = dblStationBottomLeft
    dblElevationTopLeft = dblElevationBottomLeft
    dblStationTopRight = dblStationBottomRight
    dblElevationTopRight = dblElevationBottomRight
'
' Assemble vertices of polygon of the area of water around the point
'
' First, add highest node on the bank
'
    intVertex = 0
    adblX(intVertex + 1) = dblStationTopLeft
    adblZ(intVertex + 1) = dblElevationTopLeft
    intVertex = intVertex + 1   'increment vertex
'
' Add second streamside vertex if not the first node
    If ((intPoint > intNumberofPoints) Or blnBankfull) Then
'
' Add top vertex: intersector from bank to water surface
      adblX(intVertex + 1) = dblStationTopRight
      adblZ(intVertex + 1) = dblElevationTopRight
      intVertex = intVertex + 1   'increment vertex
    End If
'
' If not the last node, add bottom vertices: intersector from bank to water surface
    If (cintMaxNumberofPoints > intPoint) Then
      dblSumAbsoluteElevation = dblSumAbsoluteElevation + Abs(adblSegmentsZ(intPoint - 1) - _
                                                            adblSegmentsZ(intPoint))
      dblStationBottomRight = dblBankIntersectStation + _
                            (dblWaterIntersectStation - dblBankIntersectStation) _
                             * dblSumAbsoluteElevation / dblTotalAbsoluteElevation
      adblX(intVertex + 1) = dblStationBottomRight
      adblZ(intVertex + 1) = dblElevationBottomRight
      intVertex = intVertex + 1   'increment vertex
'
' : bottom bank-flow segment intersector
      dblStationBottomLeft = adblSegmentsX(intPoint)
      dblElevationBottomLeft = adblSegmentsZ(intPoint)
      adblX(intVertex + 1) = dblStationBottomLeft
      adblZ(intVertex + 1) = dblElevationBottomLeft
      intVertex = intVertex + 1   'increment vertex
    ElseIf blnMoreChannel Then
'
' If water surface intersector is closer to bank than the last node, add an additional
' water surface node
      adblX(intVertex + 1) = adblBankGeomX(intPoint)
      adblZ(intVertex + 1) = dblWSElevation
      intVertex = intVertex + 1   'increment vertex
    End If
'
' Add bank node
'
    adblX(intVertex + 1) = adblBankGeomX(intPoint)
    adblZ(intVertex + 1) = adblBankGeomZ(intPoint)
    intVertex = intVertex + 1   'increment vertex
'
' Compute area and WP, divide Area by WP and write to spreadsheet
'
    adblArea(intPoint) = PolygonArea(adblX, adblZ, intVertex)
    adblWettedPerimeter(intPoint) = ((dblStationTopLeft - adblBankGeomX(intPoint)) ^ 2 _
                    + (dblElevationTopLeft - adblBankGeomZ(intPoint)) ^ 2) ^ 0.5 _
                    + ((adblBankGeomX(intPoint) - dblStationBottomLeft) ^ 2 _
                    + (adblBankGeomZ(intPoint) - dblElevationBottomLeft) ^ 2) ^ 0.5
'
' Check that wetted perimeter is not equal to zero, if it is then set to small value
'
    If adblWettedPerimeter(intPoint) = 0 Then adblWettedPerimeter(intPoint) = 0.000001
  Next intPoint
'
' Set areas for above the water surface to zero
'
  For intPoint = 1 To intNumberofPoints - 1
    adblArea(intPoint) = 0
    Worksheets("Toe Model").Cells((44 + intPoint), 2).Value = adblArea(intPoint)
  Next intPoint
'
' Initialise n, get input variables from user and estimate width
'
  dblManning = 0
  intCorrections = Worksheets("Toe Model Output").Cells(84, 5).Value
  dblWidth = adblBankGeomX(cintMaxNumberofPoints) - dblBankIntersectStation
  If (dblWaterIntersectStation - dblBankIntersectStation > dblWidth) Then dblWidth = dblWaterIntersectStation - dblBankIntersectStation
  dblWidth = 2 * dblWidth
'
' Adjust shear stress according to the no-lag model presented by Crosato (2008) and the effective shear stress
' formula of Hanson (1990)
'
  Call ComputeShearStressCorrections(adblArea, adblBankGeomZ, adblShearStress, adblWettedPerimeter, _
                                dblSlope, dblWSElevation, intNumberofPoints, intCorrections)
'
' Output the shear stresses and update the average shear stress estimate
'
  For intPoint = intNumberofPoints To cintMaxNumberofPoints
    Worksheets("Toe Model").Cells(44 + intPoint, 2).Value = adblShearStress(intPoint)
    dblAverageShearStress = dblAverageShearStress + adblShearStress(intPoint)
  Next intPoint
' ------------------------------------------------------
'
' Output average shear stress
'
  Worksheets("Toe Model Output").Cells(24, 15).Value = Application.WorksheetFunction.Round(dblAverageShearStress / _
                                                        (1 + cintMaxNumberofPoints - intNumberofPoints), 2)
End Sub

Static Function Log10(X)
    Log10 = Log(X) / Log(10#)
End Function

Function PolygonArea(dblPolygonX() As Double, dblPolygonY() As Double, _
                     intNumberofVertices As Integer) As Double
'
' PolygonArea Macro
' Macro developed 11/10/2000 by Eddy Langendoen
'
Dim intVertex As Integer
Dim intNextVertex As Integer
'
  PolygonArea = 0
  For intVertex = 1 To intNumberofVertices
    intNextVertex = intVertex + 1
    If (intNextVertex > intNumberofVertices) _
    Then intNextVertex = intNextVertex - intNumberofVertices
    PolygonArea = PolygonArea + dblPolygonX(intVertex) * dblPolygonY(intNextVertex) _
                                   - dblPolygonY(intVertex) * dblPolygonX(intNextVertex)
  Next intVertex
'
  PolygonArea = 0.5 * PolygonArea
  If (PolygonArea < 0) Then PolygonArea = -PolygonArea
End Function

Sub ComputeShearStressCorrections(adblArea() As Double, adblBankGeomZ() As Double, adblShearStress() As Double, _
                                adblWettedPerimeter() As Double, dblSlope As Double, dblWSElevation As Double, _
                                intNumberofPoints As Integer, intCorrections As Integer)
'
' ComputeShearStressCorrections Macro
' Macro developed 01/26/2010 by Rob Thomas
'
' This macro computes the additional shear stress afforded by curvature, as given by the no-lag kinematic model
' presented by Crosato (2008).
' In addition, the macro adjusts the shear stress according to the effective shear stress formula of Hanson (1990).
' It uses the grain roughness formula of Keulegan (1938) as presented in Chow (1959) and converted
' from Chezy C to Manning's n

  Const cdblA = 4.16892048974639E-02
  
  Dim dblDepth As Double
  Dim dblDiameter As Double
  Dim dblGrainRoughness As Double
  Dim dblShields As Double
  Dim dblSuperElev As Double
  Dim dblTemp As Double
  Dim dblPerturb As Double
  Dim dblVelocity As Double
  Dim intLayer As Integer
  Dim intMaterial As Integer
  Dim intPoint As Integer
  Dim intResponse As Integer
  Dim strError As String
  Dim strError1 As String
  Dim strError2 As String
  Dim strError3 As String
'
' Error Message
'
  strError = "Sorry, but in order to compute your requested corrections," & _
                vbCr & "you need to enter more data. Please try again!"
  strError1 = "The value you have entered for Manning's roughness coefficient," & _
                vbCr & "n, is outside the range that has been observed in the field." & _
                vbCr & "                     Do you want to continue?"
  strError2 = "The value you have entered for the radius of curvature," & _
                vbCr & "is outside the range that has been observed in the field." & _
                vbCr & "                     Do you want to continue?"
  strError3 = "Sorry, but the entered flow depth is greater than bankfull. This" & _
                vbCr & "violates the theory upon which adjustments for curvature are based."
'
' Initialize the interface for the Toe Model
'
'
' Catch the case where the river is overbank
  If (((intCorrections Mod 2) = 1) And (dblWSElevation > adblBankGeomZ(2))) Then
    MsgBox strError3
    End
  ElseIf (intCorrections > 0) Then
    Call ToeModelForm_Initialize
'
' Show the interface for the Toe Model
    ToeModelForm.Show
'
' Catch the case where the user does not enter values
    If (dblManning = 0) Then
      MsgBox strError
      End
'
' Catch the case where the user enters crazy Manning's n values
    ElseIf ((0.0156 > dblManning) Or (dblManning > 0.2)) Then
      intResponse = MsgBox(strError1, vbYesNo)
      If (intResponse = vbNo) Then End
    End If
  Else
    dblManning = 0.035
  End If
'
' Compute the centerline velocity
  dblTemp = adblArea(cintMaxNumberofPoints) / adblWettedPerimeter(cintMaxNumberofPoints)
  dblVelocity = (dblTemp ^ (2 / 3)) * Sqr(dblSlope) / dblManning
'
' Case statement for corrections
'
  If ((intCorrections Mod 2) = 1) Then
'
' Check for reasonable values of radius of curvature and width
    If (dblRadiusofCurvature * dblWidth = 0) Then
      MsgBox strError
      End
    ElseIf (0.5 * dblWidth > dblRadiusofCurvature) Then
      intResponse = MsgBox(strError2, vbYesNo)
      If (intResponse = vbNo) Then End
    End If
'
' Compute the outer bank super-elevation
'
' First, get maximum depth
    dblDepth = -99999999
    For intPoint = intNumberofPoints To cintMaxNumberofPoints
      If (dblWSElevation - adblBankGeomZ(intPoint) > dblDepth) Then _
          dblDepth = dblWSElevation - adblBankGeomZ(intPoint)
    Next intPoint
'
' Second, get the Shields stress for the bed/toe
'
' 2.1 Get the toe material
    intMaterial = Worksheets("Toe Model Output").Cells(74, 5).Value
'
' Case statement to determine the diameter (in metres)
    Select Case intMaterial
      Case 1 To 7
        dblTemp = Worksheets("Toe Model Output").Cells(74, 11).Value
        If (dblTemp > 1.944) Then
          dblDiameter = 0.001 * dblTemp / (0.06 * 16200)
        Else
          dblDiameter = 0.001 * dblTemp / (0.044 * 16200)
        End If
      Case 8 To 10, 17
        dblDiameter = 1.10485434560398E-05
      Case 11 To 16
        dblDiameter = 0.000001953125
    End Select
'
' 2.2 Compute the Shields stress
    dblTemp = adblArea(cintMaxNumberofPoints) / adblWettedPerimeter(cintMaxNumberofPoints)
    dblShields = ((dblManning * dblVelocity) ^ 2) / (1.65 * dblDiameter * (dblTemp ^ (1 / 3)))
'
' 2.3 Super-Elevation:
    dblSuperElev = 0.9 * dblDepth * Sqr(dblShields) * dblWidth * (1 - dblManning * Sqr(9.807) / (0.408 * (dblTemp ^ (1 / 6)))) _
                    / dblRadiusofCurvature
'
' Now compute the near bank velocities
'
' For now, omit Struiksma's empirical function for sigma as it appears to cause crazy results!
' dblPerturb = 0.5 * (dblSuperElev / dblDepth - 0.5 * dblWidth * (1 - (dblTemp ^ (1 / 6)) _
                                            * ((dblDepth / dblWidth) ^ 2) / (dblManning * Sqr(9.807))) / dblRadiusofCurvature)
    dblPerturb = 0.5 * (dblSuperElev / dblDepth + 0.5 * dblWidth / dblRadiusofCurvature)
    dblVelocity = dblVelocity * (1 + dblPerturb)
  End If
'
' Compute the near bank shear stresses as rho*g*(n^2)*(R^-1/3)*(U'^2)
' Distribute according to the ratio of Ri to Rw (index i, last point w)
  For intPoint = intNumberofPoints To cintMaxNumberofPoints
    adblShearStress(intPoint) = 9807 * (dblManning ^ 2) * (dblTemp ^ (-1 / 3)) * (dblVelocity ^ 2) _
                                * adblArea(intPoint) * adblWettedPerimeter(cintMaxNumberofPoints) _
                                / (adblArea(cintMaxNumberofPoints) * adblWettedPerimeter(intPoint))
  Next intPoint
'
' Effective stress correction
  If (intCorrections > 1) Then
    For intPoint = intNumberofPoints To cintMaxNumberofPoints
'
' Get which layer the point is in and from that get the material
      intLayer = Worksheets("Toe Model").Cells(100 + intPoint, 2).Value
      intMaterial = Worksheets("Toe Model Output").Cells(68 + intLayer, 5).Value
'
' Case statement to determine the diameter (in metres)
      Select Case intMaterial
        Case 1 To 7
          dblTemp = Worksheets("Toe Model Output").Cells(68 + intLayer, 11).Value
          If (dblTemp > 1.944) Then
            dblDiameter = dblTemp / (0.06 * 16200)
          Else
            dblDiameter = dblTemp / (0.044 * 16200)
          End If
        Case 8 To 10, 17
          dblDiameter = 1.10485434560398E-05
        Case 11 To 16
          dblDiameter = 0.000001953125
      End Select
'
' Compute Manning's grain roughness using the formula of Keulegan (1938). Limit it to 0.0156 following Temple et al.(1987)
' Temple DM, Robinson KM, Ahring RM, Davis AG. 1987. Stability Design of Grass-Lined Open Channels. USDA ARS Agriculture
' Handbook Number 667. Washington, DC: US Government Printing Office
' Use Strickler's equation as given by Chow (1959)
      dblGrainRoughness = cdblA * (dblDiameter ^ (1 / 6))
      If (0.0156 > dblGrainRoughness) Then dblGrainRoughness = 0.0156
'
' Compute effective shear stress
      adblShearStress(intPoint) = adblShearStress(intPoint) * (dblGrainRoughness / dblManning) ^ 2
    Next intPoint
  End If

End Sub

Private Sub ToeModelForm_Initialize()
'
' This is the Initialize event procedure for a form of type ToeModelForm
'
  Select Case intCorrections
'    Case 1, 3
'      ToeModelForm.WidthBox.Text = CStr(Round(dblWidth, 1))
'      ToeModelForm.RadiusBox.Text = CStr(Round(7 * dblWidth, 1))
    Case 2
      ToeModelForm.WidthBox.Visible = False
      ToeModelForm.RadiusBox.Visible = False
      ToeModelForm.Label2.Visible = False
      ToeModelForm.Label3.Visible = False
      ToeModelForm.Label4.Visible = False
      ToeModelForm.Label5.Visible = False
  End Select
'
  Load ToeModelForm
End Sub

Private Sub ToeModelHelpForm_Initialize()
'
' This is the Initialize event procedure for a form of type ToeModelHelpForm
'
  ToeModelHelpForm.MultiPage1.Value = 0
  Load ToeModelHelpForm
End Sub

Private Sub UserForm_QueryClose(Cancel As Integer, CloseMode As Integer)
  If CloseMode = vbFormControlMenu Then
'
' User clicked the X button: cancel unloading the form, use close button
' procedure instead
    Cancel = True
    FinishedButton_Click
  End If

End Sub

